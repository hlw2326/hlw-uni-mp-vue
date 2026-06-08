<template>
    <view class="hlw-reward-ad" @tap="open">
        <slot />
    </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { setRewardAd, showRewardAd, confirmRewardAd, destroyRewardAd } from "../../utils/ad";
import type { HlwRewardAdResult } from "./types";

defineOptions({ name: "HlwRewardAd" });

interface Props {
    /** 微信广告单元 ID */
    unitId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "onHandle", res: HlwRewardAdResult): void;
}>();

// 点击锁定状态，防止连续多次点击重复触发广告
const isClicked = ref(false);

async function playRewardAdFlow(): Promise<void> {
    // 弹出全局模态 Loading 状态
    let hidden = false;
    hlw.$msg.showLoading("正在拉起广告");

    // 设置 8 秒防超时定时器，如果 8 秒后还没有关闭加载提示，则强制关闭
    const timer = setTimeout(() => {
        hide();
    }, 8000);

    function hide() {
        if (hidden) return;
        hidden = true;
        clearTimeout(timer);
        hlw.$msg.hideLoading();
    }

    try {
        // 确保实例当前处于激活绑定状态
        setRewardAd(props.unitId);

        // 立即展示并播放广告
        const res = await showRewardAd(hide);

        // 播放流结束后（不管成功或退出），立刻关闭 Loading 状态
        hide();

        // 播放结束后，立即清理本地缓存引用，以防状态重叠
        destroyRewardAd(props.unitId);

        if (res.success && res.isEnded) {
            emit("onHandle", {
                success: true,
                isEnded: true,
            });
        } else if (res.err) {
            emit("onHandle", {
                success: false,
                isEnded: false,
                loadFailed: true,
                err: res.err,
            });
        } else {
            // 未看完（中途退出），提示用户是否继续观看
            const retry = await confirmRewardAd();
            if (retry) {
                // 如果用户点击继续观看，递归执行广告流程
                await playRewardAdFlow();
            } else {
                emit("onHandle", {
                    success: false,
                    isEnded: false,
                });
            }
        }
    } catch (e) {
        hide();
        destroyRewardAd(props.unitId);
        console.error("[HlwRewardAd] Failed to show reward ad:", e);
        emit("onHandle", {
            success: false,
            isEnded: false,
            loadFailed: true,
            err: e,
        });
    }
}

async function open() {
    if (isClicked.value) return;
    if (!props.unitId) {
        console.warn("[HlwRewardAd] unitId is required but empty.");
        return;
    }
    isClicked.value = true;
    try {
        await playRewardAdFlow();
    } finally {
        isClicked.value = false;
    }
}

/**
 * Expose a method for parent components to open the reward ad programmatically via ref.
 * Usage: const adRef = ref(null);
 * <hlw-reward-ad ref="adRef" :unit-id="..." />
 * adRef.value?.open();
 */
defineExpose({
    open
});

onUnmounted(() => {
    destroyRewardAd(props.unitId);
});
</script>

<style scoped>
.hlw-reward-ad {
    display: block;
}
</style>
