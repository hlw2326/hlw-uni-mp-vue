import { computed } from "vue";
import { useColor } from "@/composables/color";
import { useThemeStore } from "../../stores/theme";

const { varsToStyle } = useColor();
import { getCurrentFontVars } from "./font";
import { getCurrentThemeVars } from "./palette";
import { getCurrentAppearanceVars } from "./appearance";

/**
 * @deprecated 历史事件名；现已改用 pinia store 响应式驱动，emit 不再有效。
 * 保留 export 仅为不破坏外部 import（不影响功能）。
 */
export const THEME_CHANGE_EVENT = "hlw:theme-change";

/**
 * 只注入会随主题变化的变量（字号档位、主题色、外观模式）。
 *
 * 语义排版 token（--text-title-size 等）是静态值、不随主题变化，
 * 放在项目的全局 CSS（static/css/style.scss）里作为 page{} 默认值即可，
 * 让业务侧可以自由 override，不被运行时注入覆盖。
 */
export function buildThemeStyle(): string {
    return varsToStyle({
        ...getCurrentFontVars(),
        ...getCurrentThemeVars(),
        ...getCurrentAppearanceVars(),
    });
}

/**
 * 获取主题样式字符串，用于注入 <page-meta :page-style>。
 *
 * 实现走 pinia store 响应式：store.scale / primaryColor / appearance 任一变化
 * → computed 重算 → page-meta 自动 setData。
 *
 * 注：早期版本用 uni.$emit + onMounted+uni.$on 事件总线驱动，在 vue3 + 小程序部分
 * 基础库下 emit 后 ref 不响应（导致字号 / 主题色 / 外观切换不生效）。已改成响应式驱动。
 */
export function useThemePageStyle() {
    const store = useThemeStore();
    const themePageStyle = computed(() => {
        // 显式 track 三个响应字段，触发 computed 重算
        // setScale / setTheme / setAppearance 内部已先 set storage 再改 ref，
        // 所以 buildThemeStyle 从 storage 读到的一定是最新值
        void store.scale;
        void store.primaryColor;
        void store.appearance;
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
