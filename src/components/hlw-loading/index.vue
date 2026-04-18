<template>
    <view class="hlw-loading">
        <view class="hlw-loading__spinner" />
        <text v-if="text" class="hlw-loading__text">{{ text }}</text>
    </view>
</template>

<script setup lang="ts">
/**
 * HlwLoading — 加载动画组件
 *
 * 圆形旋转 spinner，可附带文字提示。
 *
 * @props
 *   text - 加载提示文字（可选）
 *
 * @example
 * ```vue
 * <HlwLoading text="加载中..." />
 * ```
 */
defineProps<{
    text?: string;
}>();
</script>

<style scoped>
.hlw-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24rpx;
}

.hlw-loading__spinner {
    width: 56rpx;
    height: 56rpx;
    border: 6rpx solid #e8e8e8;
    border-top-color: #07c160;
    border-radius: 50%;
    animation: hlw-spin 0.8s linear infinite;
}

@keyframes hlw-spin {
    to { transform: rotate(360deg); }
}

.hlw-loading__text {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #999;
}
</style>
