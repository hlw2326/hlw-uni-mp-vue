/**
 * useShare - 小程序分享 composable
 *
 * 两层 API 并存：
 *   - useShare(config)     —— SDK 层：直接注册 onShareAppMessage / onShareTimeline 钩子
 *   - useShareConfig(...)  —— 业务层：lazy load 后端配置 + cache + fallback resolver
 */
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { unwrapPayload, type AdapterPayload } from '../_internal/unwrap';

export interface ShareAppMessageContent {
    /** 分享标题 */
    title?: string;
    /** 分享路径，必须是以 / 开头的完整路径 */
    path?: string;
    /** 自定义图片路径 */
    imageUrl?: string;
}

export interface ShareTimelineContent {
    /** 朋友圈分享标题 */
    title?: string;
    /** 页面携带的 query 参数 */
    query?: string;
    /** 自定义图片路径 */
    imageUrl?: string;
}

export interface ShareConfig extends ShareAppMessageContent {
    /** 朋友圈专属配置，不填则复用朋友分享配置 */
    timeline?: ShareTimelineContent;
}

/**
 * 分享来源。
 * - `button` 页面内转发按钮
 * - `menu` 右上角菜单
 */
export type ShareFrom = 'button' | 'menu';

export type ShareConfigResolver = (from: ShareFrom) => ShareConfig;

/**
 * 注册小程序分享钩子。
 */
export function useShare(config: ShareConfig | ShareConfigResolver) {
    /**
     * 根据分享来源解析最终分享配置。
     */
    const resolve = (from: ShareFrom): ShareConfig =>
        typeof config === 'function' ? config(from) : config;

    /**
     * 注册分享给朋友的回调。
     */
    onShareAppMessage((options: { from?: string } | undefined) => {
        const resolved = resolve((options?.from as ShareFrom) ?? 'menu');
        const payload: ShareAppMessageContent = {};
        if (resolved.title !== undefined) payload.title = resolved.title;
        if (resolved.path !== undefined) payload.path = resolved.path;
        if (resolved.imageUrl !== undefined) payload.imageUrl = resolved.imageUrl;
        return payload;
    });

    /**
     * 注册分享到朋友圈的回调。
     */
    onShareTimeline(() => {
        const resolved = resolve('menu');
        const timeline = resolved.timeline ?? {};
        const payload: ShareTimelineContent = {};
        const title = timeline.title ?? resolved.title;
        const imageUrl = timeline.imageUrl ?? resolved.imageUrl;
        if (title !== undefined) payload.title = title;
        if (timeline.query !== undefined) payload.query = timeline.query;
        if (imageUrl !== undefined) payload.imageUrl = imageUrl;
        return payload;
    });
}

/* ============================================================
 * useShareConfig —— 业务层：lazy load 后端聚合配置 + cache + fallback resolver
 *
 * 后端按页面 key 聚合返回各页 title / image，前端拉一次缓存全局共用。
 * 返回的 resolver 同时喂给 onShareAppMessage 和 onShareTimeline。
 *
 * 使用方式：
 *
 *   1. App.vue / bootstrap 注入回调：
 *
 *      setConfigShare({
 *          getConfig: async () => {
 *              const res = await getShareConfig();
 *              return res.code === 1 ? res.data : null;
 *          },
 *      });
 *
 *   2. 任意页面 setup：
 *
 *      const share = useShareConfig("index", {
 *          title: "兜底标题",
 *          path: "/pages/index/index",
 *      });
 *      onShareAppMessage(share);
 *      onShareTimeline(share);
 * ============================================================ */

/** 单页分享配置 */
export interface PageShareItem {
    title: string;
    image: string;
}

/** 后端返回的页面 key → 配置映射 */
export type ShareConfigMap = Record<string, PageShareItem>;

/**
 * Adapter 注入接口 —— getConfig 支持「已解包」或「ThinkAdmin envelope」两种返回值。
 * 业务方可以直接传 envelope-returning 接口：setConfigShare({ getConfig: getShareConfig })
 */
export interface ShareConfigAdapter {
    getConfig: () => Promise<AdapterPayload<ShareConfigMap>>;
}

/** 页面声明的兜底文案 / 跳转路径 */
export interface PageShareFallback {
    /** 后端 title 为空时用 */
    title: string;
    /** 分享跳转路径（必须 / 开头）；path 不走后端，由页面自定义 */
    path: string;
    /** 后端 image 为空时用；通常留空让微信自动截图 */
    image?: string;
}

/** 分享 payload —— 同时喂给 onShareAppMessage / onShareTimeline */
export interface SharePayload {
    title: string;
    path: string;
    imageUrl?: string;
}

let shareAdapter: ShareConfigAdapter | null = null;
const shareCache = ref<ShareConfigMap | null>(null);
let sharePending: Promise<void> | null = null;

/**
 * 注入业务回调（应用启动时调用一次；不调用则始终用 fallback）。
 */
export function setConfigShare(a: ShareConfigAdapter): void {
    shareAdapter = a;
}

function loadShareConfig(): Promise<void> {
    if (shareCache.value) return Promise.resolve();
    if (sharePending) return sharePending;
    if (!shareAdapter?.getConfig) {
        console.warn("[useShareConfig] adapter.getConfig 未注入；先调用 setConfigShare()");
        return Promise.resolve();
    }
    sharePending = shareAdapter.getConfig()
        .then((raw) => {
            const cfg = unwrapPayload(raw);
            if (cfg) shareCache.value = cfg;
        })
        .catch((e) => {
            console.warn("[useShareConfig] load failed", e);
        })
        .finally(() => {
            sharePending = null;
        });
    return sharePending;
}

/**
 * 业务级分享配置 helper —— 返回 resolver，可直接喂 onShareAppMessage / onShareTimeline。
 * 后端配置异步加载，加载完成前先用 fallback、加载完后自动切到后端值。
 */
export function useShareConfig(pageKey: string, fallback: PageShareFallback) {
    void loadShareConfig();
    return (): SharePayload => {
        const remote = shareCache.value?.[pageKey];
        const title = remote?.title || fallback.title;
        const image = remote?.image || fallback.image;
        const payload: SharePayload = { title, path: fallback.path };
        if (image) payload.imageUrl = image;
        return payload;
    };
}
