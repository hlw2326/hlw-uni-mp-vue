import { ref, computed, onMounted, onUnmounted } from "vue";

// ─── 字体档位 ────────────────────────────────────────

export type FontScale = "small" | "normal" | "large" | "xlarge";

export const FONT_SCALE_KEY = "hlw_font_scale";

export interface FontPreset {
    label: string;
    style: string;
}

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

export function getCurrentFontScale(): FontScale {
    try {
        const v = uni.getStorageSync(FONT_SCALE_KEY);
        if (v === "small" || v === "large" || v === "xlarge") return v;
    } catch {}
    return "normal";
}

export function getCurrentFontStyle(): string {
    return FONT_PRESETS[getCurrentFontScale()].style;
}

// ─── 主题色 ──────────────────────────────────────────

export interface ThemeColor {
    label: string;
    value: string;
}

export const THEME_COLOR_KEY = "hlw_theme_color";

/** 内置预设主题色 */
export const DEFAULT_THEMES: ThemeColor[] = [
    { label: "默认蓝", value: "#3b82f6" },
    { label: "活力橙", value: "#f97316" },
    { label: "翡翠绿", value: "#10b981" },
    { label: "玫瑰红", value: "#f43f5e" },
    { label: "紫罗兰", value: "#8b5cf6" },
    { label: "青石灰", value: "#64748b" },
];

export function getCurrentThemeColor(): string {
    try {
        const v = uni.getStorageSync(THEME_COLOR_KEY);
        if (v && typeof v === "string") return v;
    } catch {}
    return DEFAULT_THEMES[0].value;
}

export function getCurrentThemeStyle(): string {
    return `--primary-color:${getCurrentThemeColor()};`;
}

// ─── 统一事件 ────────────────────────────────────────

/** 字体 / 主题色变更时统一广播此事件 */
export const THEME_CHANGE_EVENT = "hlw:theme-change";

// ─── 组合式函数 ──────────────────────────────────────

/**
 * 在页面中使用，配合 <page-meta :page-style="themePageStyle"> 注入字体 + 主题色。
 *
 * @example
 * ```vue
 * <template>
 *   <page-meta :page-style="themePageStyle" />
 *   <hlw-page title="xxx">...</hlw-page>
 * </template>
 * <script setup>
 * import { useThemePageStyle } from '@hlw-uni/mp-vue';
 * const { themePageStyle } = useThemePageStyle();
 * </script>
 * ```
 */
export function useThemePageStyle() {
    const themePageStyle = ref(getCurrentFontStyle() + getCurrentThemeStyle());

    const onThemeChange = () => {
        themePageStyle.value = getCurrentFontStyle() + getCurrentThemeStyle();
    };

    onMounted(() => uni.$on(THEME_CHANGE_EVENT, onThemeChange));
    onUnmounted(() => uni.$off(THEME_CHANGE_EVENT, onThemeChange));

    return { themePageStyle };
}
