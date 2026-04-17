import { useColor } from "@hlw-uni/mp-core";

const { hexToRgba, darkenHex } = useColor();

export interface ThemeColor {
    label: string;
    value: string;
}

export const THEME_COLOR_KEY = "hlw_theme_color";

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

export function getCurrentThemeVars(): Record<string, string> {
    const color = getCurrentThemeColor();
    return {
        "--primary-color": color,
        "--primary-light": hexToRgba(color, 0.12),
        "--primary-dark": darkenHex(color),
    };
}
