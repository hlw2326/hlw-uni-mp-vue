/**
 * @hlw-uni/mp-vue — Vue 组件库统一导出
 */

export { default as HlwAd } from "./components/hlw-ad/index.vue";
export { default as HlwAvatar } from "./components/hlw-avatar/index.vue";
export { default as HlwCard } from "./components/hlw-card/index.vue";
export { default as HlwEmpty } from "./components/hlw-empty/index.vue";
export { default as HlwHeader } from "./components/hlw-header/index.vue";
export { default as HlwLoading } from "./components/hlw-loading/index.vue";
export { default as HlwMenu } from "./components/hlw-menu/index.vue";
export type { HlwMenuItem } from "./components/hlw-menu/types";
export { default as HlwPage } from "./components/hlw-page/index.vue";
export type { FontScale, FontPreset } from "./composables/font-presets";
export { FONT_PRESETS, FONT_SCALE_KEY, FONT_SCALE_EVENT, getCurrentFontScale, getCurrentFontStyle, useFontPageStyle } from "./composables/font-presets";
export { useFontStore } from "./stores/font";
