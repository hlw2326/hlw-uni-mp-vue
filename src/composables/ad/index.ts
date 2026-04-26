/**
 * useAd —— 完整的广告业务封装
 *
 * 内置了：
 *   - 6 个 unit_id 配置（store 缓存，调 getConfig 拉一次）
 *   - 激励视频：广告加载 loading → onShown 自动关闭 → 中途关闭挽留 modal → 看完调业务方的 claim 发奖
 *   - 插屏：一行调用
 *   - 底层 SDK 适配（onLoad / offClose / show 兜底 / 实例缓存）
 *
 * 业务侧使用方式：
 *
 *   1. 在 App.vue 注入「全局」回调（拿配置 + 校验登录）：
 *
 *      import { setConfigAd } from "@hlw-uni/mp-vue";
 *      import { getAdConfig } from "@/api/ad";
 *      import { useUserStore } from "@/store";
 *
 *      setConfigAd({
 *          getConfig: async () => {
 *              const res = await getAdConfig();
 *              return res.code === 1 && res.data ? res.data : null;
 *          },
 *          isAuth: () => !!useUserStore().token,
 *      });
 *
 *   2. 任意页面拉配置 / 用 unit_id 渲染：
 *
 *      const { config, loadConfig, showPopup } = useAd();
 *      await loadConfig();
 *      <hlw-ad type="banner" :unit-id="config.banner" />
 *
 *   3. 看广告领奖励（业务方按场景传不同的 claim 接口）：
 *
 *      const ok = await showReward(async () => {
 *          const res = await claimAdReward();
 *          return res.code === 1
 *              ? { ok: true, reward: res.data?.reward }
 *              : { ok: false, msg: res.info };
 *      });
 *
 *      // 不传 claim 就是纯展示，看完即返回 true
 *      const ok = await showReward();
 */

import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useMsg, type HlwMsg } from "../msg";
import { unwrapPayload, type AdapterPayload } from "../_internal/unwrap";

/** showPopup 默认延迟（ms）：避免一进页面就弹打扰用户 */
const DEFAULT_POPUP_DELAY_MS = 3000;

/** 6 种广告类型 */
export type AdType = "banner" | "grid" | "custom" | "video" | "reward" | "popup";

/** 广告配置 —— 字段名跟后端表列名对齐（plugin_qz_mp.{type}_unit_id） */
export interface AdConfig {
    banner_unit_id: string;
    grid_unit_id: string;
    custom_unit_id: string;
    video_unit_id: string;
    reward_unit_id: string;
    popup_unit_id: string;
}

/** 广告错误对象（onError 回调参数） */
export interface AdError {
    errCode: number;
    errMsg: string;
}

/**
 * 业务回调注入接口 —— setConfigAd 时由项目提供。
 *
 * getConfig 支持两种返回：
 *   - 已解包：直接返回 AdConfig 或 null
 *   - ThinkAdmin envelope：返回 { code, data } 对象，库自动按 code===1 解包
 *
 * 业务方可以直接传 envelope-returning 的接口函数引用：
 *   setConfigAd({ getConfig: getAdConfig })
 */
export interface AdAdapter {
    getConfig: () => Promise<AdapterPayload<AdConfig>>;
    /** 是否已登录；不传 = 不校验（showReward 调用前会问一次） */
    isAuth?: () => boolean;
}

/** 激励视频关闭回调返回 */
export interface AdCloseResult {
    /** 用户是否完整观看 */
    isEnded: boolean;
}

const EMPTY: AdConfig = {
    banner_unit_id: "",
    grid_unit_id: "",
    custom_unit_id: "",
    video_unit_id: "",
    reward_unit_id: "",
    popup_unit_id: "",
};

let adapter: AdAdapter | null = null;

/** 进行中的 loadConfig promise；并发调用时复用，避免冷启动多发请求 */
let pending: Promise<void> | null = null;

/**
 * 注入业务回调，应用启动时调用一次。
 * 不调用也不会崩，但 loadConfig / showReward 会无效。
 */
export function setConfigAd(a: AdAdapter): void {
    adapter = a;
}

const useAdStore = defineStore("hlw_ad", () => {
    const config = ref<AdConfig>({ ...EMPTY });
    const loaded = ref(false);
    return { config, loaded };
});

/* ============================================================
 * 内部状态：消息单例 + 广告实例缓存
 * ============================================================ */

let _msg: HlwMsg | null = null;
const msg = (): HlwMsg => (_msg ??= useMsg());

interface RewardedEntry {
    ad: any;
    /** 同一 unit_id 是否在 load 中，避免并发 */
    loading: boolean;
}
const rewardedCache = new Map<string, RewardedEntry>();
const interstitialCache = new Map<string, any>();

/* ============================================================
 * 公共 composable
 * ============================================================ */

export function useAd() {
    const store = useAdStore();
    const { config, loaded } = storeToRefs(store);

    /**
     * 拉取广告配置（小程序冷启动后调一次即可）。
     * 并发调用复用同一次请求；`force=true` 跳过 loaded/pending 短路重新拉。
     */
    async function loadConfig(force = false): Promise<void> {
        if (loaded.value && !force) return;
        if (pending && !force) return pending;
        if (!adapter?.getConfig) {
            console.warn("[useAd] adapter.getConfig 未注入；先调用 setConfigAd()");
            return;
        }
        const fn = adapter.getConfig;
        const flight = (async () => {
            try {
                const cfg = unwrapPayload(await fn());
                if (cfg) {
                    store.config = cfg;
                    store.loaded = true;
                }
            } catch (e) {
                console.warn("[useAd] load config failed", e);
            } finally {
                if (pending === flight) pending = null;
            }
        })();
        pending = flight;
        return flight;
    }

    /** 取指定类型的 unit_id（hlw-ad 组件 / 业务直接调时用） */
    function getUnitId(type: AdType): string {
        return store.config[`${type}_unit_id` as keyof AdConfig] || "";
    }

    /**
     * 显示激励视频 —— 播一次、关闭后调 onClose（带 isEnded），其它都交给业务。
     *
     *   showReward(({ isEnded }) => {
     *       if (!isEnded) confirm().then(goon => goon && tapReward());
     *       else claimAdReward().then(...);
     *   });
     *
     * @param onClose 关闭回调；不传则只播。retry / toast / 发奖全在业务侧自己写。
     */
    async function showReward(onClose?: (res: AdCloseResult) => void | Promise<void>): Promise<void> {
        const unitId = getUnitId("reward");
        if (!unitId) {
            msg().toast("激励广告未配置");
            return;
        }
        if (adapter?.isAuth && !adapter.isAuth()) {
            msg().toast("请先登录");
            return;
        }
        const closeRes = await playRewardedOnce(unitId);
        if (onClose) await onClose(closeRes);
    }

    /**
     * 显示插屏广告
     * @returns true=展示成功；false=配置缺失 / show 失败（如近期已展示过）
     */
    /**
     * 显示插屏广告，默认延迟 3000ms 避免一进页面就弹打扰；传 0 立即弹。
     * @returns true=展示成功；false=配置缺失 / show 失败（如近期已展示过）
     *
     * 实现注意：用 setTimeout + .then() 串接而非 async/await，保持 WX 插屏
     * ad.show() 的调用栈跟 setTimeout 回调一致 —— 小程序引擎对插屏的合法
     * 触发时机敏感，async/await 多插的 microtask 会被判为"非合法触发"导致
     * 静默不弹。
     */
    function showPopup(delayMs: number = DEFAULT_POPUP_DELAY_MS): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                loadConfig().then(() => {
                    const unitId = getUnitId("popup");
                    if (!unitId) {
                        resolve(false);
                        return;
                    }
                    showInterstitialAd(unitId).then(resolve);
                });
            }, delayMs);
        });
    }

    return {
        // 状态
        config,
        loaded,
        // 方法
        loadConfig,
        getUnitId,
        showReward,
        showPopup,
        confirm: confirmModal,
    };
}

/* ============================================================
 * 内部 helper：业务流程层
 * ============================================================ */

/** 播放一次激励视频，期间显示加载提示，广告 UI 弹出后自动 hide */
async function playRewardedOnce(unitId: string): Promise<AdCloseResult> {
    msg().showLoading("广告加载中");
    let hidden = false;
    const hide = () => {
        if (hidden) return;
        hidden = true;
        msg().hideLoading();
    };
    try {
        const isEnded = await showRewardedAd(unitId, { onShown: hide });
        return { isEnded };
    } finally {
        // 兜底：如果 onShown 没触发（show 直接 reject 等），最终也得关 loading
        hide();
    }
}

/**
 * 激励视频中途关闭挽留弹窗 —— 通过 useAd().confirm 暴露给业务方：
 *
 *   const { showReward, confirm } = useAd();
 *   showReward(async ({ isEnded }) => {
 *       if (!isEnded) return { ok: false, retry: await confirm() };
 *       const r = await claimAdReward();
 *       return r.code === 1 ? { ok: true, reward: r.data?.reward } : { ok: false, msg: r.info };
 *   });
 *
 * @returns true=用户选「继续观看」 / false=放弃
 */
function confirmModal(): Promise<boolean> {
    return new Promise((resolve) => {
        uni.showModal({
            title: "提示",
            content: "看完广告才可以领取奖励哦，要继续观看吗？",
            confirmText: "继续观看",
            cancelText: "放弃",
            success: (r) => resolve(!!r.confirm),
            fail: () => resolve(false),
        });
    });
}

/* ============================================================
 * 内部 helper：底层 SDK 适配
 * ============================================================ */

/**
 * 底层激励视频包装：onClose / onError 解绑 + load + show 兜底
 *
 * @param hooks.onShown 广告 UI 已渲染时回调（业务用来关 loading）
 */
function showRewardedAd(unitId: string, hooks?: { onShown?: () => void }): Promise<boolean> {
    return new Promise((resolve) => {
        let entry = rewardedCache.get(unitId);
        if (!entry) {
            const ad: any = uni.createRewardedVideoAd({ adUnitId: unitId });
            if (!ad) { resolve(false); return; }
            ad.onError?.((err: AdError) => {
                console.warn(`[useAd] reward onError (${unitId})`, err);
            });
            entry = { ad, loading: false };
            rewardedCache.set(unitId, entry);
        }
        const { ad } = entry;

        let closeHandler: ((res: { isEnded: boolean }) => void) | null = null;
        let errorHandler: ((err: AdError) => void) | null = null;
        const cleanup = () => {
            if (closeHandler) { ad.offClose?.(closeHandler); closeHandler = null; }
            if (errorHandler) { ad.offError?.(errorHandler); errorHandler = null; }
        };
        closeHandler = (res) => {
            cleanup();
            resolve(!!(res && res.isEnded));
        };
        errorHandler = (err) => {
            console.warn(`[useAd] reward show error (${unitId})`, err);
            cleanup();
            resolve(false);
        };
        ad.onClose(closeHandler);
        ad.onError(errorHandler);

        const doShow = () =>
            ad.show()
                .then(() => {
                    try { hooks?.onShown?.(); } catch (e) { console.warn("[useAd] onShown error", e); }
                })
                .catch(() => {
                    cleanup();
                    resolve(false);
                });

        if (entry.loading) {
            Promise.resolve().then(doShow);
        } else {
            entry.loading = true;
            ad.load()
                .then(doShow)
                .catch(doShow)
                .finally(() => { if (entry) entry.loading = false; });
        }
    });
}

/** 底层插屏广告包装：实例按 unitId 缓存复用，show 失败 console.warn 不重试（频控/网络等失败重试也救不了） */
function showInterstitialAd(unitId: string): Promise<boolean> {
    return new Promise((resolve) => {
        let ad: any = interstitialCache.get(unitId);
        if (!ad) {
            // 老基础库可能没有这个 API（对应官方 if (wx.createInterstitialAd)）
            if (typeof uni.createInterstitialAd !== "function") {
                console.warn("[useAd] 当前基础库不支持插屏广告");
                resolve(false);
                return;
            }
            ad = uni.createInterstitialAd({ adUnitId: unitId });
            if (!ad) { resolve(false); return; }
            ad.onError?.((err: AdError) => {
                console.warn(`[useAd] popup onError (${unitId})`, err);
            });
            interstitialCache.set(unitId, ad);
        }
        ad.show()
            .then(() => resolve(true))
            .catch((err: any) => {
                console.warn(`[useAd] popup show error (${unitId})`, err);
                resolve(false);
            });
    });
}

/** 销毁全部广告实例并清空缓存（业务一般不用，hot reload 时调） */
export function destroyAds(): void {
    rewardedCache.forEach((e) => e.ad?.destroy?.());
    rewardedCache.clear();
    interstitialCache.forEach((ad) => ad?.destroy?.());
    interstitialCache.clear();
}
