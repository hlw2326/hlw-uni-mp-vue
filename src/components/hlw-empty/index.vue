<template>
    <view class="hlw-empty">
        <image v-if="image" class="hlw-empty__image" :src="image" mode="aspectFit" />
        <text v-else class="hlw-empty__icon">📦</text>
        <text class="hlw-empty__text">{{ text || '暂无数据' }}</text>
        <slot />
    </view>
</template>

<script setup lang="ts">
defineProps<{
    text?: string;
    image?: string;
}>();
</script>

<style scoped>
.hlw-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 40rpx;
}

.hlw-empty__image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 24rpx;
}

.hlw-empty__icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
}

.hlw-empty__text {
    font-size: var(--font-base, 28rpx);
    color: #bbb;
}
</style>
