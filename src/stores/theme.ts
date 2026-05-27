import { defineStore } from "pinia";

// ==========================================
// 1. 主题 (Theme) 预设与类型
// ==========================================

export interface ThemePreset {
    id: string;
    name: string;
    color: string;
}

export const themePresets: ThemePreset[] = [
    {
        id: "white-theme",
        name: "白色主题",
        color: "#ffffff",
    },
    {
        id: "light-theme",
        name: "简洁主题",
        color: "#f1f5f9",
    },
    {
        id: "mono-theme",
        name: "单色主题",
        color: "var(--bg-color, var(--bg-page, #f8f8f8))",
    },
    {
        id: "color-theme",
        name: "颜色主题",
        color: "var(--primary-color, #3b82f6)",
    },
];

// ==========================================
// 2. 字体大小 (FontSize) 预设与类型
// ==========================================

export interface FontSizePreset {
    id: string;
    name: string;
    class: string;
}

export const fontSizePresets: FontSizePreset[] = [
    {
        id: "small",
        name: "较小",
        class: "font-size-small",
    },
    {
        id: "standard",
        name: "标准",
        class: "font-size-standard",
    },
    {
        id: "large",
        name: "较大",
        class: "font-size-large",
    },
    {
        id: "extra-large",
        name: "超大",
        class: "font-size-extra-large",
    },
];

// ==========================================
// 3. 字体样式 (FontFamily) 预设与类型
// ==========================================

export interface FontFamilyPreset {
    id: string;
    name: string;
    class: string;
}

export const fontFamilyPresets: FontFamilyPreset[] = [
    {
        id: "system",
        name: "系统默认",
        class: "font-family-system",
    },
    {
        id: "sans",
        name: "现代黑体",
        class: "font-family-sans",
    },
    {
        id: "serif",
        name: "经典宋体",
        class: "font-family-serif",
    },
    {
        id: "kaiti",
        name: "优雅楷体",
        class: "font-family-kaiti",
    },
];

// ==========================================
// 4. 统一个性化配置 Store (Theme / Font)
// ==========================================

export const useThemeStore = defineStore("theme", {
    state: () => ({
        theme: "white-theme",
        fontSize: "standard",
        fontFamily: "system",
    }),
    getters: {},
    actions: {
        setFontSize(size: string) {
            if (["small", "standard", "large", "extra-large"].includes(size)) {
                this.fontSize = size;
            }
        },
        setFontFamily(font: string) {
            if (["system", "sans", "serif", "kaiti"].includes(font)) {
                this.fontFamily = font;
            }
        },
    },
    unistorage: true,
});
