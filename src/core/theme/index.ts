import { computed } from "vue";
import type { ComputedRef } from "vue";
import { 
    useThemeStore, 
    fontSizePresets, 
    fontFamilyPresets 
} from "../../stores/theme";

declare const uni: any;

export { 
    fontSizePresets, 
    type FontSizePreset, 
    fontFamilyPresets, 
    type FontFamilyPreset 
} from "../../stores/theme";

// ==========================================
// 统一个性化外观配置 Hook (useTheme)
// ==========================================

export function useTheme() {
    const store = useThemeStore();
    
    // 字体大小
    const fontSize: ComputedRef<string> = computed(() => store.fontSize);
    const fontSizeClass: ComputedRef<string> = computed(() => {
        const found = fontSizePresets.find((p) => p.id === store.fontSize);
        return found ? found.class : "font-size-standard";
    });

    // 字体样式
    const fontFamily: ComputedRef<string> = computed(() => store.fontFamily);
    const fontFamilyClass: ComputedRef<string> = computed(() => {
        const found = fontFamilyPresets.find((p) => p.id === store.fontFamily);
        return found ? found.class : "font-family-system";
    });

    // 动作方法
    function setFontSize(size: string): void {
        store.setFontSize(size);
    }

    function setFontFamily(font: string): void {
        store.setFontFamily(font);
    }

    return {
        fontSize,
        fontSizeClass,
        setFontSize,
        fontFamily,
        fontFamilyClass,
        setFontFamily,
        store,
    };
}

/**
 * 首次打开小程序时，初始化默认的主题配色
 * @param defaultTheme 默认主题 ID，默认为 "mono-theme"
 */
export function initTheme(defaultTheme?: string): void {
    // No-op after color theme presets removal
}
