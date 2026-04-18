/**
 * @hlw-uni/mp-vue package root exports
 *
 * Note:
 * Components are resolved through easycom using `@hlw-uni/mp-vue/src/components/...`.
 * The package root only exports plain TS modules so uni-app does not try to bundle
 * compiled SFC runtime helpers from the library entry.
 */

export type { FontScale, FontPreset, ThemeColor } from "./composables/theme";
export type { HlwMenuItem } from "./components/hlw-menu/types";
export {
    FONT_PRESETS,
    FONT_SCALE_KEY,
    DEFAULT_THEMES,
    THEME_COLOR_KEY,
    THEME_CHANGE_EVENT,
    getCurrentFontScale,
    getCurrentFontVars,
    getCurrentThemeColor,
    getCurrentThemeVars,
    buildThemeStyle,
    useThemePageStyle,
} from "./composables/theme";
export { useThemeStore } from "./stores/theme";
