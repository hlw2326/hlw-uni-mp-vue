/**
 * Composables 统一导出
 */
export * from "./request";
export { useMsg, type HlwMsg, type ToastOptions, type ModalOptions, type ToastIcon } from "./msg";
export {
    useDevice,
    clearDeviceCache,
    type DeviceInfo,
    type DeviceQueryInfo,
} from "./device";
export { useRefs } from "./refs";
export {
    useShare,
    type ShareConfig,
} from "./share";
export { useHlwAd, type AdRes } from "./ad";
export {
    useUtils,
    withQuery,
    toQuery,
    signText,
    toNumber,
    toBoolean,
    copy,
    paste,
    auth,
    saveImage,
    saveVideoFile,
    download,
    saveImageUrl,
    saveVideoUrl,
    type DownloadOpt,
    type DownloadRes,
} from "./utils";
export { useNavigate, type NavigateType, type NavigateOptions } from "./navigator";

// Theme（mp-vue 自带）
export type { FontScale, FontPreset } from "./theme";
export {
    FONT_SCALE_KEY,
    FONT_PRESETS,
    getCurrentFontScale,
    getCurrentFontVars,
    THEME_CHANGE_EVENT,
    buildThemeStyle,
    useThemePageStyle,
} from "./theme";
export type { ThemeColor } from "./theme";
export {
    THEME_COLOR_KEY,
    THEME_SEMANTIC_COLORS,
    DEFAULT_THEMES,
    getCurrentThemeColor,
    getCurrentThemeVars,
} from "./theme";
export type { Appearance, AppearanceMode, AppearancePreset } from "./theme";
export {
    APPEARANCE_KEY,
    APPEARANCE_PRESETS,
    APPEARANCE_VAR_MAP,
    getCurrentAppearance,
    getCurrentAppearanceMode,
    getCurrentAppearanceVars,
    resolveAppearance,
} from "./theme";
export type { TypographyRole } from "./theme";
export { TYPOGRAPHY_ROLES, getCurrentTypographyVars } from "./theme";
