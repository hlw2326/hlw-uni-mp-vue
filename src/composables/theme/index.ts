import { ref, onMounted, onUnmounted } from "vue";
import { useColor } from "@hlw-uni/mp-core";

const { varsToStyle } = useColor();
import { getCurrentFontVars } from "./font";
import { getCurrentThemeVars } from "./palette";
import { getCurrentAppearanceVars } from "./appearance";

export const THEME_CHANGE_EVENT = "hlw:theme-change";

export function buildThemeStyle(): string {
    return varsToStyle({
        ...getCurrentFontVars(),
        ...getCurrentThemeVars(),
        ...getCurrentAppearanceVars(),
    });
}

export function useThemePageStyle() {
    const themePageStyle = ref(buildThemeStyle());

    const onThemeChange = () => {
        themePageStyle.value = buildThemeStyle();
    };

    onMounted(() => uni.$on(THEME_CHANGE_EVENT, onThemeChange));
    onUnmounted(() => uni.$off(THEME_CHANGE_EVENT, onThemeChange));

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
