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

export const useThemeStore = defineStore(
    "theme",
    () => {
        // ─── 字体档位 ────────────────────────────
        const scale = ref<FontScale>("normal");

        function setScale(s: FontScale) {
            scale.value = s;
            uni.setStorageSync(FONT_SCALE_KEY, s);
            uni.$emit(THEME_CHANGE_EVENT);
        }

        const fontOptions = (Object.keys(FONT_PRESETS) as FontScale[]).map((key) => ({
            value: key,
            label: FONT_PRESETS[key].label,
        }));

        // ─── 主题色 ─────────────────────────────
        const primaryColor = ref(DEFAULT_THEMES[0].value);

        /** 内置预设主题 */
        const themes = DEFAULT_THEMES;

        /** 当前激活的主题信息 */
        const activeTheme = computed<ThemeColor>(() =>
            themes.find((t: ThemeColor) => t.value === primaryColor.value)
                ?? { label: "自定义", value: primaryColor.value },
        );

        /** 设置主题色（预设或自定义颜色值） */
        function setTheme(color: string) {
            primaryColor.value = color;
            uni.setStorageSync(THEME_COLOR_KEY, color);
            uni.$emit(THEME_CHANGE_EVENT);
        }

        // ─── 外观模式（light / dark / auto） ─────────
        const appearance = ref<Appearance>("auto");

        const appearanceOptions = APPEARANCE_PRESETS;

        /** 当前实际生效的模式（auto 会被解析为 light/dark） */
        const appearanceMode = computed<AppearanceMode>(() => resolveAppearance(appearance.value));

        /** 是否深色模式（业务组件可直接读取做条件渲染） */
        const isDark = computed(() => appearanceMode.value === "dark");

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
