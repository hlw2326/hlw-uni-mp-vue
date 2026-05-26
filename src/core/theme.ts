import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useThemeStore } from "../stores/theme";

export { themePresets, type ThemePreset } from "../stores/theme";

export function useTheme() {
    const store = useThemeStore();
    const theme: ComputedRef<string> = computed(() => store.theme);
    return {
        theme,
        store,
    };
}
