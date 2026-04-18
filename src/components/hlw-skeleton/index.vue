<template>
    <view v-if="loading" class="hlw-skeleton" :class="{ 'hlw-skeleton--animate': animate }">
        <view v-if="avatar" class="hlw-skeleton-avatar" :class="`hlw-skeleton-avatar--${avatarSize}`" />
        <view class="hlw-skeleton-content">
            <view v-if="title" class="hlw-skeleton-title" />
            <view v-for="i in rows" :key="i" class="hlw-skeleton-row" :style="{ width: i === rows ? '60%' : '100%' }" />
        </view>
    </view>
    <slot v-else />
</template>

<script setup lang="ts">
/**
 * HlwSkeleton — 骨架屏
 *
 * 数据加载占位，支持头像 + 标题 + 多行文字组合。loading 为 false 时显示默认插槽内容。
 *
 * @props
 *   loading    - 是否显示骨架屏，默认 true
 *   rows       - 文字行数，默认 3
 *   avatar     - 是否显示头像占位，默认 false
 *   title      - 是否显示标题占位，默认 true
 *   animate    - 是否启用脉冲动画，默认 true
 *   avatarSize - 头像尺寸：small / medium / large，默认 medium
 *
 * @slots
 *   default - 加载完成后显示的真实内容
 *
 * @example
 * ```vue
 * <HlwSkeleton :loading="loading" avatar :rows="4">
 *   <view>真实数据内容</view>
 * </HlwSkeleton>
 * ```
 */
interface Props {
    loading?: boolean;
    rows?: number;
    avatar?: boolean;
    title?: boolean;
    animate?: boolean;
    avatarSize?: "small" | "medium" | "large";
}

withDefaults(defineProps<Props>(), {
    loading: true,
    rows: 3,
    avatar: false,
    title: true,
    animate: true,
    avatarSize: "medium",
});
</script>

<style lang="scss" scoped>
.hlw-skeleton {
    display: flex;
    gap: 24rpx;
    padding: 24rpx;
}

.hlw-skeleton-avatar {
    flex-shrink: 0;
    border-radius: 50%;
    background: #e2e8f0;

    &--small { width: 56rpx; height: 56rpx; }
    &--medium { width: 80rpx; height: 80rpx; }
    &--large { width: 120rpx; height: 120rpx; }
}

.hlw-skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.hlw-skeleton-title {
    width: 40%;
    height: 32rpx;
    border-radius: 6rpx;
    background: #e2e8f0;
}

.hlw-skeleton-row {
    height: 24rpx;
    border-radius: 6rpx;
    background: #e2e8f0;
}

.hlw-skeleton--animate {
    .hlw-skeleton-avatar,
    .hlw-skeleton-title,
    .hlw-skeleton-row {
        animation: hlw-skeleton-pulse 1.5s ease-in-out infinite;
    }
}

@keyframes hlw-skeleton-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}
</style>
