import { computed } from "vue";
import { useThemeStore } from "../../stores/theme";

import { getCurrentFontVars } from "./font";
import { getCurrentThemeVars } from "./palette";

/**
 * @deprecated 历史事件名；现已改用 pinia store 响应式驱动，emit 不再有效。
 * 保留 export 仅为不破坏外部 import（不影响功能）。
 */
export const THEME_CHANGE_EVENT = "hlw:theme-change";

/**
 * 构建仅注入运行时配置变量（字号档位、主题色）的行内样式字符串。
 * 
 * 页面背景、卡片色、文字色、边框色等业务视觉变量统一由项目全局 CSS
 * （static/css/style.scss）控制，避免 page-meta 运行时样式覆盖业务侧配置。
 * 
 * @returns 扁平化后的 CSS 变量样式属性字符串
 */
export function buildThemeStyle(): string {
    return varsToStyle({
        ...getCurrentFontVars(),
        ...getCurrentThemeVars(),
    });
}

/**
 * 将 CSS 键值对对象平铺拼接为 CSS inline style 格式字符串。
 */
function varsToStyle(vars: Record<string, string>): string {
    return Object.entries(vars).map(([key, value]) => `${key}:${value}`).join(";") + ";";
}

/**
 * 获取及监听主题与字号变化，返回可注入到 `<page-meta :page-style="themePageStyle">` 的计算属性。
 *
 * 实现基于 pinia store 响应式：当 store 中的字号档位或主题色发生改变时，
 * 触发计算属性重算并由 Vue 自动更新至 `<page-meta>` 的 setData 接口。
 *
 * @returns 包含 `themePageStyle` 计算属性的对象
 * 
 * @example
 * ```vue
 * <template>
 *   <page-meta :page-style="themePageStyle" />
 *   <view class="container">...</view>
 * </template>
 * 
 * <script setup>
 * const { themePageStyle } = useThemePageStyle();
 * </script>
 * ```
 */
export function useThemePageStyle() {
    const store = useThemeStore();
    const themePageStyle = computed(() => {
        // 显式 track 两个响应字段，触发 computed 重算
        // setScale / setTheme 内部已先 set storage 再改 ref，
        // 所以 buildThemeStyle 从 storage 读到的一定是最新值
        void store.scale;
        void store.primaryColor;
        return buildThemeStyle();
    });
    return { themePageStyle };
}

export type { FontScale, FontPreset } from "./font";
export { FONT_SCALE_KEY, FONT_PRESETS, getCurrentFontScale, getCurrentFontVars } from "./font";
export type { ThemeColor } from "./palette";
export {
    THEME_COLOR_KEY,
    THEME_SEMANTIC_COLORS,
    DEFAULT_THEMES,
    getCurrentThemeColor,
    getCurrentThemeVars,
} from "./palette";
export type { Appearance, AppearanceMode, AppearancePreset } from "./appearance";
export {
    APPEARANCE_KEY,
    APPEARANCE_PRESETS,
    APPEARANCE_VAR_MAP,
    getCurrentAppearance,
    getCurrentAppearanceMode,
    getCurrentAppearanceVars,
    resolveAppearance,
} from "./appearance";
export type { TypographyRole } from "./typography";
export { TYPOGRAPHY_ROLES, getCurrentTypographyVars } from "./typography";
