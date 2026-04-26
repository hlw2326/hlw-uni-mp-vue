import { useColor } from "@/composables/color";

const { hexToRgba, darkenHex } = useColor();

export interface ThemeColor {
    label: string;
    value: string;
}

export const THEME_COLOR_KEY = "hlw_theme_color";

export const THEME_SEMANTIC_COLORS = {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#64748b",
} as const;

export const DEFAULT_THEMES: ThemeColor[] = [
    { label: "翡翠绿", value: "#10b981" },
    { label: "活力橙", value: "#f97316" },
    { label: "默认蓝", value: "#3b82f6" },
    { label: "玫瑰粉", value: "#f43f5e" },
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
        "--primary-success": THEME_SEMANTIC_COLORS.success,
        "--primary-success-light": hexToRgba(THEME_SEMANTIC_COLORS.success, 0.12),
        "--primary-success-dark": darkenHex(THEME_SEMANTIC_COLORS.success),
        "--primary-warning": THEME_SEMANTIC_COLORS.warning,
        "--primary-warning-light": hexToRgba(THEME_SEMANTIC_COLORS.warning, 0.12),
        "--primary-warning-dark": darkenHex(THEME_SEMANTIC_COLORS.warning),
        "--primary-error": THEME_SEMANTIC_COLORS.error,
        "--primary-error-light": hexToRgba(THEME_SEMANTIC_COLORS.error, 0.12),
        "--primary-error-dark": darkenHex(THEME_SEMANTIC_COLORS.error),
        "--primary-info": THEME_SEMANTIC_COLORS.info,
        "--primary-info-light": hexToRgba(THEME_SEMANTIC_COLORS.info, 0.12),
        "--primary-info-dark": darkenHex(THEME_SEMANTIC_COLORS.info),
        "--success-color": THEME_SEMANTIC_COLORS.success,
        "--success-light": hexToRgba(THEME_SEMANTIC_COLORS.success, 0.12),
        "--success-dark": darkenHex(THEME_SEMANTIC_COLORS.success),
        "--warning-color": THEME_SEMANTIC_COLORS.warning,
        "--warning-light": hexToRgba(THEME_SEMANTIC_COLORS.warning, 0.12),
        "--warning-dark": darkenHex(THEME_SEMANTIC_COLORS.warning),
        "--error-color": THEME_SEMANTIC_COLORS.error,
        "--error-light": hexToRgba(THEME_SEMANTIC_COLORS.error, 0.12),
        "--error-dark": darkenHex(THEME_SEMANTIC_COLORS.error),
        "--info-color": THEME_SEMANTIC_COLORS.info,
        "--info-light": hexToRgba(THEME_SEMANTIC_COLORS.info, 0.12),
        "--info-dark": darkenHex(THEME_SEMANTIC_COLORS.info),
    };
}
