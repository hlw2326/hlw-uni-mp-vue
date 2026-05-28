import { computed, watch, onMounted } from "vue";
import type { ComputedRef } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { 
    useThemeStore, 
    themePresets, 
    fontSizePresets, 
    fontFamilyPresets 
} from "../stores/theme";

declare const uni: any;

export { 
    themePresets, 
    type ThemePreset, 
    fontSizePresets, 
    type FontSizePreset, 
    fontFamilyPresets, 
    type FontFamilyPreset 
} from "../stores/theme";

// ==========================================
// 统一个性化外观配置 Hook (useTheme)
// ==========================================

export function useTheme() {
    const store = useThemeStore();
    
    // 主题
    const theme: ComputedRef<string> = computed(() => store.theme);

    // 辅助方法：设置系统状态栏/导航栏前景色（mono-theme 和 color-theme 设为白色，其余为黑色）
    const updateNavbarColor = (targetTheme: string) => {
        const isDarkTheme = ["mono-theme", "color-theme"].includes(targetTheme);
        uni.setNavigationBarColor({
            frontColor: isDarkTheme ? "#ffffff" : "#000000",
            backgroundColor: isDarkTheme ? "#3b82f6" : "#ffffff",
            fail: () => {}
        });
    };

    // 1. 监控主题属性改变时，动态刷新
    watch(
        theme,
        (newTheme) => {
            updateNavbarColor(newTheme);
        }
    );

    // 2. 组件/页面挂载完成时，执行一次设定
    onMounted(() => {
        updateNavbarColor(store.theme);
    });

    // 3. 页面显示或回退时，强行重刷前景色（try-catch 规避非 Page 的报错）
    try {
        onShow(() => {
            updateNavbarColor(store.theme);
        });
    } catch (e) {
        // 忽略非 Page 组件的绑定失败
    }

    // 4. 在 setup 初始化同步阶段以最快速度设定一次，尽可能规避生命周期滞后导致的闪烁
    updateNavbarColor(store.theme);
    
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
        theme,
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
export function initTheme(defaultTheme = "mono-theme"): void {
    const hasCachedTheme = uni.getStorageSync("theme");
    if (!hasCachedTheme) {
        const store = useThemeStore();
        const validThemes = themePresets.map((t) => t.id);
        if (validThemes.includes(defaultTheme)) {
            store.theme = defaultTheme;
        }
    }
}

