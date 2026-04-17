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
