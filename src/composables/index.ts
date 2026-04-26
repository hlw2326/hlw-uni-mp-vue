/**
 * Composables 统一导出
 */
export * from "./http";
export { useLoading } from "./loading";
export { useMsg, type HlwMsg, type ToastOptions, type ModalOptions, type ToastIcon } from "./msg";
export { useDevice, deviceToQuery, clearDeviceCache, type DeviceInfo } from "./device";
export { useRefs } from "./refs";
export { usePageMeta } from "./page-meta";
export { useStorage, type StorageInstance } from "./storage";
export { useValidate } from "./validate";
export { useFormat } from "./format";
export {
    useAd,
    setConfigAd,
    destroyAds,
    type AdType,
    type AdConfig,
    type AdError,
    type AdAdapter,
    type AdCloseResult,
} from "./ad";
export {
    useShare,
    useShareConfig,
    setConfigShare,
    type ShareConfig,
    type ShareConfigResolver,
    type ShareFrom,
    type ShareAppMessageContent,
    type ShareTimelineContent,
    type ShareConfigMap,
    type ShareConfigAdapter,
    type PageShareItem,
    type PageShareFallback,
    type SharePayload,
} from "./share";
export {
    useContact,
    setConfigContact,
    type ContactConfig,
    type ContactAdapter,
    type ContactBindProps,
} from "./contact";
export { useUtils, type DownloadFileOptions, type DownloadFileResult, type TapEvent } from "./utils";
export { useColor } from "./color";
export { useRouter, type NavigateType, type NavigateOptions } from "./navigator";
export { useUuid } from "./algo";

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
