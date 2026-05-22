/**
 * 主题颜色配置项接口。
 */
export interface ThemeColor {
    /** 颜色名称描述 */
    label: string;
    /** 主题色十六进制值 (Hex Color) */
    value: string;
}

/** 存储当前主题色设置的 LocalStorage 键名 */
export const THEME_COLOR_KEY = "hlw_theme_color";

/**
 * 预设的语义化颜色。
 * 包含成功、警告、错误和提示的默认色彩配置。
 */
export const THEME_SEMANTIC_COLORS = {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#64748b",
} as const;

/**
 * 系统预设的默认主题色列表。
 */
export const DEFAULT_THEMES: ThemeColor[] = [
    { label: "翡翠绿", value: "#10b981" },
    { label: "活力橙", value: "#f97316" },
    { label: "默认蓝", value: "#3b82f6" },
    { label: "玫瑰粉", value: "#f43f5e" },
    { label: "紫罗兰", value: "#8b5cf6" },
    { label: "青石灰", value: "#64748b" },
];

/**
 * 读取当前配置的主题色 Hex 字符串。
 * 默认使用 `DEFAULT_THEMES` 数组中首位颜色的值。
 * @returns 十六进制颜色字符串
 */
export function getCurrentThemeColor(): string {
    try {
        const v = uni.getStorageSync(THEME_COLOR_KEY);
        if (v && typeof v === "string") return v;
    } catch {}
    return DEFAULT_THEMES[0].value;
}

/**
 * 获取当前主题色所对应的完整 CSS 颜色语义变量映射表。
 * 会基于当前主题色，自动计算衍生出对应的亮色调、暗色调以及各状态色语义变量。
 * @returns 包含各 CSS 变量名与对应颜色值键值对
 */
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

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * 将 6 位 hex 颜色字符串转换为 RGB 三原色元组。
 */
function parseHex(hex: string): [number, number, number] {
    if (!HEX_RE.test(hex)) throw new Error(`Invalid hex color: ${hex}`);
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

/**
 * 转换 Hex 颜色为 rgba 格式字符串。
 */
function hexToRgba(hex: string, alpha: number): string {
    const [r, g, b] = parseHex(hex);
    return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * 将 Hex 颜色调暗。
 */
function darkenHex(hex: string, amount = 0.15): string {
    const [r, g, b] = parseHex(hex);
    const darken = (value: number) => Math.max(0, Math.round(value * (1 - amount)));
    return `#${darken(r).toString(16).padStart(2, "0")}${darken(g).toString(16).padStart(2, "0")}${darken(b).toString(16).padStart(2, "0")}`;
}
