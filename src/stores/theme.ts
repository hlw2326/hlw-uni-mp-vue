/**
 * Theme Store — 全局主题设置（字体档位 + 主题色）
 * 持久化到 storage，变更时广播 THEME_CHANGE_EVENT 通知所有页面实时刷新
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    FONT_PRESETS,
    FONT_SCALE_KEY,
    DEFAULT_THEMES,
    THEME_COLOR_KEY,
    THEME_CHANGE_EVENT,
    APPEARANCE_KEY,
    APPEARANCE_PRESETS,
    resolveAppearance,
} from "../composables/theme";
import type { FontScale, ThemeColor, Appearance, AppearanceMode } from "../composables/theme";

/**
 * 统一管理全局主题、字体缩放和外观模式的 Pinia Store。
 */
export const useThemeStore = defineStore(
    "theme",
    () => {
        // ─── 字体档位 ────────────────────────────
        /** 当前生效的字体大小档位 */
        const scale = ref<FontScale>("normal");

        /**
         * 改变并保存当前的字体大小档位。
         * 
         * @param s 目标字体大小档位
         */
        function setScale(s: FontScale) {
            scale.value = s;
            uni.setStorageSync(FONT_SCALE_KEY, s);
            uni.$emit(THEME_CHANGE_EVENT);
        }

        /** 供界面渲染选择的字体档位选项列表 */
        const fontOptions = (Object.keys(FONT_PRESETS) as FontScale[]).map((key) => ({
            value: key,
            label: FONT_PRESETS[key].label,
        }));

        // ─── 主题色 ─────────────────────────────
        /** 当前生效的主题色十六进制值 (Hex Color) */
        const primaryColor = ref(DEFAULT_THEMES[0].value);

        /** 系统内置的预设主题颜色列表 */
        const themes = DEFAULT_THEMES;

        /** 当前激活的主题色相关信息 */
        const activeTheme = computed<ThemeColor>(() =>
            themes.find((t: ThemeColor) => t.value === primaryColor.value)
                ?? { label: "自定义", value: primaryColor.value },
        );

        /**
         * 更改并保存全局主题色。
         * 
         * @param color 颜色 Hex 字符串
         */
        function setTheme(color: string) {
            primaryColor.value = color;
            uni.setStorageSync(THEME_COLOR_KEY, color);
            uni.$emit(THEME_CHANGE_EVENT);
        }

        // ─── 外观模式（light / dark / auto） ─────────
        /** 当前设置的外观显示模式：浅色、深色或自动跟随系统 */
        const appearance = ref<Appearance>("auto");

        /** 可供选择的外观预设配置列表 */
        const appearanceOptions = APPEARANCE_PRESETS;

        /** 当前最终解析的实际生效模式（auto 会依据系统检测解析为 light 或 dark） */
        const appearanceMode = computed<AppearanceMode>(() => resolveAppearance(appearance.value));

        /** 是否正处于深色模式，可供业务组件在 template 中直接用作条件渲染 */
        const isDark = computed(() => appearanceMode.value === "dark");

        /**
         * 改变外观设置模式。
         * 
         * @param a 目标模式
         */
        function setAppearance(a: Appearance) {
            appearance.value = a;
            uni.setStorageSync(APPEARANCE_KEY, a);
            uni.$emit(THEME_CHANGE_EVENT);
        }

        return {
            // 字体
            scale,
            fontOptions,
            setScale,
            // 主题色
            primaryColor,
            themes,
            activeTheme,
            setTheme,
            // 外观模式
            appearance,
            appearanceOptions,
            appearanceMode,
            isDark,
            setAppearance,
        };
    },
    { unistorage: true },
);

