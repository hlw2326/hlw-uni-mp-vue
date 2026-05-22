/**
 * 外观模式 — 浅色 / 深色 / 跟随系统
 *
 * 提供一套语义化 CSS 变量（--bg-page, --surface-card, --text-primary ...）。
 * 默认不通过 useThemePageStyle 注入，业务项目应在全局 CSS 中声明这些变量，
 * 避免运行时 page-meta 覆盖业务侧样式。
 *
 * 使用指南：
 * - 业务样式里用 `var(--text-primary)` 代替硬编码 `#0f172a`
 * - 用 `var(--surface-card)` 代替硬编码 `#ffffff`
 * - 用 `var(--border-color-light)` 代替硬编码 `#f1f5f9`
 */

/** 外观模式选项类型：浅色模式、深色模式、跟随系统 */
export type Appearance = "light" | "dark" | "auto";

/** 实际生效的外观模式：仅浅色或深色 */
export type AppearanceMode = "light" | "dark";

/**
 * 外观预设配置接口。
 */
export interface AppearancePreset {
    /** 选项值 */
    value: Appearance;
    /** 选项展示名称 */
    label: string;
}

/** 存储外观设置的 LocalStorage 键名 */
export const APPEARANCE_KEY = "hlw_appearance";

/** 预设外观模式列表，常供设置页渲染选择器使用 */
export const APPEARANCE_PRESETS: AppearancePreset[] = [
    { value: "light", label: "浅色模式" },
    { value: "dark", label: "深色模式" },
    { value: "auto", label: "跟随系统" },
];

/** 浅色模式语义变量 */
const LIGHT_VARS: Record<string, string> = {
    "--bg-page": "#f6f6f6",
    "--bg-elevated": "#ffffff",
    "--surface-card": "#ffffff",
    "--surface-card-muted": "#f8fafc",
    "--surface-secondary": "#f1f5f9",
    "--surface-tertiary": "#e2e8f0",
    "--text-primary": "#0f172a",
    "--text-secondary": "#334155",
    "--text-muted": "#64748b",
    "--text-subtle": "#94a3b8",
    "--text-disabled": "#cbd5e1",
    "--border-color": "#e2e8f0",
    "--border-color-light": "#f1f5f9",
    "--border-color-focus": "#bfdbfe",
    "--shadow-soft": "0 2rpx 8rpx rgba(15, 23, 42, 0.04)",
    "--shadow-card": "0 4rpx 16rpx rgba(15, 23, 42, 0.06)",
};

/** 深色模式语义变量 */
const DARK_VARS: Record<string, string> = {
    "--bg-page": "#0b1020",
    "--bg-elevated": "#111827",
    "--surface-card": "#1e293b",
    "--surface-card-muted": "#273549",
    "--surface-secondary": "#273549",
    "--surface-tertiary": "#334155",
    "--text-primary": "#f8fafc",
    "--text-secondary": "#cbd5e1",
    "--text-muted": "#94a3b8",
    "--text-subtle": "#64748b",
    "--text-disabled": "#475569",
    "--border-color": "#334155",
    "--border-color-light": "#1e293b",
    "--border-color-focus": "#3b82f6",
    "--shadow-soft": "0 2rpx 8rpx rgba(0, 0, 0, 0.3)",
    "--shadow-card": "0 4rpx 16rpx rgba(0, 0, 0, 0.35)",
};

/** 不同外观模式的 CSS 变量映射 */
export const APPEARANCE_VAR_MAP: Record<AppearanceMode, Record<string, string>> = {
    light: LIGHT_VARS,
    dark: DARK_VARS,
};

/**
 * 读取用户设置的外观配置（light / dark / auto）。
 * 默认返回 'auto'。
 * @returns 设定的外观模式类型
 */
export function getCurrentAppearance(): Appearance {
    try {
        const v = uni.getStorageSync(APPEARANCE_KEY);
        if (v === "light" || v === "dark" || v === "auto") return v;
    } catch {}
    return "auto";
}

/**
 * 将 auto 设置或用户选择解析为具体的 light/dark 实际模式。
 * 当为 auto 时，将读取系统当前的配色偏好。
 * @param appearance 输入的外观配置
 * @returns 解析后最终生效的外观模式 (light 或 dark)
 */
export function resolveAppearance(appearance: Appearance): AppearanceMode {
    if (appearance === "light" || appearance === "dark") return appearance;
    try {
        const info = uni.getSystemInfoSync();
        if ((info as { theme?: string }).theme === "dark") return "dark";
    } catch {}
    return "light";
}

/**
 * 获取当前实际生效的外观模式 (light 或 dark)。
 * 自动根据用户偏好及系统主题进行判定。
 * @returns 实际生效的外观模式
 */
export function getCurrentAppearanceMode(): AppearanceMode {
    return resolveAppearance(getCurrentAppearance());
}

/**
 * 获取当前外观对应的 CSS 变量映射表。
 * @returns 包含各 CSS 变量名与对应颜色值键值对
 */
export function getCurrentAppearanceVars(): Record<string, string> {
    return APPEARANCE_VAR_MAP[getCurrentAppearanceMode()];
}
