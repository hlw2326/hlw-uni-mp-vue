/**
 * 语义化排版 token — 把"字号 + 字重 + 行高 + 颜色"打包成角色，统一各页面文字样式。
 *
 * 使用指南：
 * - 页面样式里用 `var(--text-title-size)` 等变量代替硬编码，自动响应字体档位/外观模式切换
 * - 或通过全局 utility class（见 qz2 项目的 static/css/style.scss）直接加 class
 *
 * 6 个语义角色：
 * - title-lg: 页面大标题 / hero
 * - title:    卡片 / 分区主标题
 * - subtitle: 次级标题
 * - body:     正文
 * - desc:     卡片描述 / 副文
 * - caption:  角标 / 底部小字 / 时间戳
 */

export interface TypographyRole {
    /** 对应 `--text-{role}-size` 的值（通常引用字号档位 token） */
    size: string;
    /** 对应 `--text-{role}-weight` */
    weight: string;
    /** 对应 `--text-{role}-line-height` */
    lineHeight: string;
    /** 对应 `--text-{role}-color`（通常引用文字色 token） */
    color: string;
}

export const TYPOGRAPHY_ROLES: Record<string, TypographyRole> = {
    "title-lg": {
        size: "var(--font-xl)",
        weight: "600",
        lineHeight: "1.2",
        color: "var(--text-primary)",
    },
    "title": {
        size: "var(--font-md)",
        weight: "500",
        lineHeight: "1.3",
        color: "var(--text-primary)",
    },
    "subtitle": {
        size: "var(--font-base)",
        weight: "500",
        lineHeight: "1.3",
        color: "var(--text-secondary)",
    },
    "body": {
        size: "var(--font-base)",
        weight: "400",
        lineHeight: "1.5",
        color: "var(--text-secondary)",
    },
    "desc": {
        size: "var(--font-sm)",
        weight: "400",
        lineHeight: "1.4",
        color: "var(--text-subtle)",
    },
    "caption": {
        size: "var(--font-xs)",
        weight: "500",
        lineHeight: "1.3",
        color: "var(--text-muted)",
    },
};

/**
 * 展开成 CSS 变量平铺 map，用于 buildThemeStyle 注入 page 元素。
 *
 * 每个角色产出 4 个变量：
 *   --text-{role}-size / -weight / -line-height / -color
 */
export function getCurrentTypographyVars(): Record<string, string> {
    const vars: Record<string, string> = {};
    for (const [role, cfg] of Object.entries(TYPOGRAPHY_ROLES)) {
        vars[`--text-${role}-size`] = cfg.size;
        vars[`--text-${role}-weight`] = cfg.weight;
        vars[`--text-${role}-line-height`] = cfg.lineHeight;
        vars[`--text-${role}-color`] = cfg.color;
    }
    return vars;
}
