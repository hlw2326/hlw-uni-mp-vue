import { ref, onMounted, onUnmounted } from "vue";

/**
 * hlw-page 字体档位预设
 *
 * 三档：标准 / 大字体 / 超大字体
 * 通过 <page-meta page-style="..."> 注入到页面根节点，
 * 覆盖 CSS 变量，所有使用 var(--font-*) 的组件自动跟随。
 */

export type FontScale = "small" | "normal" | "large" | "xlarge";

/** storage key，与 qz2 font store 保持一致 */
export const FONT_SCALE_KEY = "hlw_font_scale";

/** 全局事件名，store.setScale 触发后 hlw-page 实时响应 */
export const FONT_SCALE_EVENT = "hlw:font-scale-change";

export interface FontPreset {
    /** 展示名称 */
    label: string;
    /** 注入到 page-meta 的 CSS 变量字符串 */
    style: string;
}

/**
 * 三档字体预设
 *
 * 变量说明：
 *   --font-xs    极小文字（角标、辅助标注）
 *   --font-sm    小文字（次要说明、标签、grid-label）
 *   --font-base  正文（菜单项、内容主体）
 *   --font-md    中等（次级标题）
 *   --font-lg    大号（页面标题、导航标题）
 *   --font-xl    特大（数字展示）
 */
export const FONT_PRESETS: Record<FontScale, FontPreset> = {
    small: {
        label: "小字体",
        style: "--font-xs:16rpx;--font-sm:20rpx;--font-base:24rpx;--font-md:28rpx;--font-lg:32rpx;--font-xl:36rpx;",
    },
    normal: {
        label: "标准",
        style: "--font-xs:20rpx;--font-sm:24rpx;--font-base:28rpx;--font-md:32rpx;--font-lg:36rpx;--font-xl:40rpx;",
    },
    large: {
        label: "大字体",
        style: "--font-xs:24rpx;--font-sm:30rpx;--font-base:34rpx;--font-md:40rpx;--font-lg:46rpx;--font-xl:52rpx;",
    },
    xlarge: {
        label: "超大字体",
        style: "--font-xs:28rpx;--font-sm:36rpx;--font-base:42rpx;--font-md:48rpx;--font-lg:56rpx;--font-xl:64rpx;",
    },
};

/** 读取当前档位（同步，从 storage 取） */
export function getCurrentFontScale(): FontScale {
    try {
        const v = uni.getStorageSync(FONT_SCALE_KEY);
        if (v === "small" || v === "large" || v === "xlarge") return v;
    } catch {}
    return "normal";
}

/** 读取当前档位对应的 page-style 字符串 */
export function getCurrentFontStyle(): string {
    return FONT_PRESETS[getCurrentFontScale()].style;
}

/**
 * 在页面根节点使用，配合 <page-meta :page-style="fontPageStyle"> 实现全局字体缩放。
 *
 * 注意：<page-meta> 必须作为页面 .vue 文件 template 的第一个根节点，不可放在子组件内。
 *
 * @example
 * ```vue
 * <template>
 *   <page-meta :page-style="fontPageStyle" />
 *   <hlw-page title="xxx">...</hlw-page>
 * </template>
 * <script setup>
 * import { useFontPageStyle } from '@hlw-uni/mp-vue';
 * const { fontPageStyle } = useFontPageStyle();
 * </script>
 * ```
 */
export function useFontPageStyle() {
    const fontPageStyle = ref(getCurrentFontStyle());

    const onFontChange = () => {
        fontPageStyle.value = getCurrentFontStyle();
    };

    onMounted(() => uni.$on(FONT_SCALE_EVENT, onFontChange));
    onUnmounted(() => uni.$off(FONT_SCALE_EVENT, onFontChange));

    return { fontPageStyle };
}
