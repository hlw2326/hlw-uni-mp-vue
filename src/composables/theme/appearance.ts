/**
 * 外观模式 — 浅色 / 深色 / 跟随系统
 *
 * 提供一套语义化 CSS 变量（--bg-page, --surface-card, --text-primary ...），
 * 页面通过 hlw-page 的 `:page-style` 注入到 `page` 元素，让内部组件和样式统一消费。
 *
 * 使用指南：
 * - 业务样式里用 `var(--text-primary)` 代替硬编码 `#0f172a`
 * - 用 `var(--surface-card)` 代替硬编码 `#ffffff`
 * - 用 `var(--border-color-light)` 代替硬编码 `#f1f5f9`
 */

export type Appearance = "light" | "dark" | "auto";
export type AppearanceMode = "light" | "dark";

export interface AppearancePreset {
    value: Appearance;
    label: string;
}

export const APPEARANCE_KEY = "hlw_appearance";

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

export const APPEARANCE_VAR_MAP: Record<AppearanceMode, Record<string, string>> = {
    light: LIGHT_VARS,
    dark: DARK_VARS,
};

/** 读取用户设置的外观（light/dark/auto），默认 auto */
export function getCurrentAppearance(): Appearance {
    try {
        const v = uni.getStorageSync(APPEARANCE_KEY);
        if (v === "light" || v === "dark" || v === "auto") return v;
    } catch {}
    return "auto";
}

/** 将 auto 解析为具体的 light/dark，依据系统主题 */
export function resolveAppearance(appearance: Appearance): AppearanceMode {
    if (appearance === "light" || appearance === "dark") return appearance;
    try {
        const info = uni.getSystemInfoSync();
        if ((info as { theme?: string }).theme === "dark") return "dark";
    } catch {}
    return "light";
}

/** 当前实际生效的模式（light 或 dark） */
export function getCurrentAppearanceMode(): AppearanceMode {
    return resolveAppearance(getCurrentAppearance());
}

/** 当前外观对应的 CSS 变量 */
export function getCurrentAppearanceVars(): Record<string, string> {
    return APPEARANCE_VAR_MAP[getCurrentAppearanceMode()];
}
