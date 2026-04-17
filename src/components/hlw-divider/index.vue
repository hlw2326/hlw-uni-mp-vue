<template>
    <view class="hlw-divider" :class="[`hlw-divider--${position}`, { 'hlw-divider--dashed': dashed }]">
        <view class="hlw-divider-line" />
        <view v-if="text || $slots.default" class="hlw-divider-text">
            <slot>{{ text }}</slot>
        </view>
        <view class="hlw-divider-line" />
    </view>
</template>

<script setup lang="ts">
interface Props {
    text?: string;
    position?: "left" | "center" | "right";
    dashed?: boolean;
}

withDefaults(defineProps<Props>(), {
    text: "",
    position: "center",
    dashed: false,
});
</script>

<style lang="scss" scoped>
.hlw-divider {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
}

.hlw-divider-line {
    flex: 1;
    height: 1rpx;
    background: var(--border-color, #e2e8f0);

    .hlw-divider--dashed & {
        background: none;
        border-top: 1rpx dashed var(--border-color, #e2e8f0);
    }
}

.hlw-divider-text {
    padding: 0 24rpx;
    font-size: var(--font-xs, 20rpx);
    color: #94a3b8;
    white-space: nowrap;
}

.hlw-divider--left .hlw-divider-line:first-child { max-width: 60rpx; }
.hlw-divider--right .hlw-divider-line:last-child { max-width: 60rpx; }
</style>
