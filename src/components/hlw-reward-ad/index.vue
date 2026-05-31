<template>
    <view class="hlw-reward-ad" @tap="handleClick">
        <slot />
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { setRewardAd, showRewardAd, confirmRewardAd } from "../../utils/ad";

defineOptions({ name: "HlwRewardAd" });

interface Props {
    /** 微信广告单元 ID */
    unitId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "onHandle", res: { success: boolean; isEnded: boolean; err?: any }): void;
}>();

// 点击锁定状态，防止连续多次点击重复触发广告
const isClicked = ref(false);

/**
 * 提前初始化并静默加载广告实例的辅助方法。
 */
function preloadAd(id: string) {
    if (!id) return;
    // 异步静默加载，不使用 await 阻塞组件渲染或生命周期
    setRewardAd(id).catch((err) => {
        console.warn("[HlwRewardAd] Preload error:", err);
    });
}

// 组件挂载时，提前执行激励视频广告的初始化与加载
onMounted(() => {
    preloadAd(props.unitId);
});

// 监听 unitId 的变化，确保广告单元 ID 动态改变时能够重新静默加载
watch(
    () => props.unitId,
    (newId) => {
        preloadAd(newId);
    },
);

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

        if (res.success && res.isEnded) {
            emit("onHandle", {
                success: true,
                isEnded: true,
            });
        } else if (res.err) {
            emit("onHandle", {
                success: false,
                isEnded: false,
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
        console.error("[HlwRewardAd] Failed to show reward ad:", e);
        emit("onHandle", {
            success: false,
            isEnded: false,
            err: e,
        });
    }
}

async function handleClick() {
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
    async open() {
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
});
</script>

<style scoped>
.hlw-reward-ad {
    display: block;
    width: 100%;
}
</style>
