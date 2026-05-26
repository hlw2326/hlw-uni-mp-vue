import { defineStore } from "pinia";

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
        color: "var(--primary-color, #3b82f6)",
    },
    {
        id: "color-theme",
        name: "颜色主题",
        color: "var(--primary-color, #3b82f6)",
    },
];

export const useThemeStore = defineStore("theme", {
    state: () => ({
        // 主题定义支持这四个值：
        // 1. "white-theme" - 白色主题 (默认)
        // 2. "light-theme" - 简洁主题
        // 3. "mono-theme" - 单色主题
        // 4. "color-theme" - 颜色主题
        theme: "white-theme",
    }),
    getters: {},
    actions: {},
    unistorage: true,
});
