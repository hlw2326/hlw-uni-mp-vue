<template>
    <view class="hlw-menu-list">
        <view
            v-for="item in items"
            :key="item.key"
            class="hlw-menu-list__item"
            @tap="onTap(item)"
        >
            <view class="hlw-menu-list__left">
                <text v-if="item.icon" class="hlw-menu-list__icon">{{ item.icon }}</text>
                <text class="hlw-menu-list__label">{{ item.label }}</text>
            </view>
            <view class="hlw-menu-list__right">
                <text v-if="item.value" class="hlw-menu-list__value">{{ item.value }}</text>
                <text class="hlw-menu-list__arrow">›</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import type { MenuItem } from './types';

const props = defineProps<{
    items: MenuItem[];
}>();

const emit = defineEmits<{
    (e: 'click', item: MenuItem): void;
}>();

function onTap(item: MenuItem) {
    if (item.url) {
        uni.navigateTo({ url: item.url });
    } else if (item.action) {
        item.action();
    }
    emit('click', item);
}
</script>

<style scoped>
.hlw-menu-list {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
}

.hlw-menu-list__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.hlw-menu-list__item:last-child {
    border-bottom: none;
}

.hlw-menu-list__left {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.hlw-menu-list__icon {
    font-size: 36rpx;
    width: 44rpx;
    text-align: center;
}

.hlw-menu-list__label {
    font-size: 30rpx;
    color: #333;
}

.hlw-menu-list__right {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.hlw-menu-list__value {
    font-size: 28rpx;
    color: #999;
}

.hlw-menu-list__arrow {
    font-size: 36rpx;
    color: #ccc;
    line-height: 1;
}
</style>
