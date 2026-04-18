<template>
    <view v-if="!closed" class="hlw-notice" :style="{ color, background }">
        <view v-if="leftIcon" :class="leftIcon" class="hlw-notice-left-icon" />
        <view v-else class="hlw-notice-left-icon i-fa6-solid-bullhorn" />
        <view class="hlw-notice-wrap" @tap="$emit('click')">
            <view v-if="scrollable" class="hlw-notice-scroll" :style="animStyle">
                <text class="hlw-notice-text">{{ text }}</text>
            </view>
            <text v-else class="hlw-notice-text hlw-notice-text--ellipsis">{{ text }}</text>
        </view>
        <view v-if="closable" class="hlw-notice-close i-fa6-solid-xmark" @tap="onClose" />
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
    text?: string;
    scrollable?: boolean;
    closable?: boolean;
    color?: string;
    background?: string;
    speed?: number;
    leftIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    text: "",
    scrollable: true,
    closable: false,
    color: "#ed6a0c",
    background: "#fffbe8",
    speed: 60,
    leftIcon: "",
});

defineEmits<{ close: []; click: [] }>();

const closed = ref(false);
const duration = computed(() => Math.max(3, (props.text.length * 20) / props.speed));
const animStyle = computed(() => ({ animationDuration: `${duration.value}s` }));

function onClose() {
    closed.value = true;
}
</script>

<style lang="scss" scoped>
.hlw-notice {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx;
    gap: 12rpx;
    font-size: var(--font-sm, 24rpx);
}

.hlw-notice-left-icon {
    flex-shrink: 0;
    font-size: var(--font-base, 28rpx);
}

.hlw-notice-wrap {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
}

.hlw-notice-scroll {
    display: inline-block;
    white-space: nowrap;
    animation: hlw-notice-scroll linear infinite;
    padding-left: 100%;
}

.hlw-notice-text {
    display: inline;
}

.hlw-notice-text--ellipsis {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hlw-notice-close {
    flex-shrink: 0;
    font-size: 28rpx;
    line-height: 1;
    opacity: 0.6;
    padding: 4rpx;
}

@keyframes hlw-notice-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}
</style>
