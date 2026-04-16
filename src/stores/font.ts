/**
 * Font Store — 全局字体档位设置
 * 持久化到 storage，变更时广播 FONT_SCALE_EVENT 通知所有页面实例实时刷新
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { FONT_PRESETS, FONT_SCALE_EVENT, FONT_SCALE_KEY } from "../composables/font-presets";
import type { FontScale } from "../composables/font-presets";

export const useFontStore = defineStore(
    "font",
    () => {
        const scale = ref<FontScale>("normal");

        /** 切换字体档位，自动持久化并通知页面刷新 */
        function setScale(s: FontScale) {
            scale.value = s;
            uni.setStorageSync(FONT_SCALE_KEY, s);
            uni.$emit(FONT_SCALE_EVENT);
        }

        /** 所有可选档位列表，供 UI 遍历 */
        const options = (Object.keys(FONT_PRESETS) as FontScale[]).map((key) => ({
            value: key,
            label: FONT_PRESETS[key].label,
        }));

        return { scale, options, setScale };
    },
    { unistorage: true },
);
