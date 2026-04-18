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
} from "../composables/theme";
import type { FontScale, ThemeColor } from "../composables/theme";

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
        };
    },
    { unistorage: true },
);
