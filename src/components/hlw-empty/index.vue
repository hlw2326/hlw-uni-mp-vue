<template>
    <view class="hlw-empty">
        <image v-if="image" class="hlw-empty__image" :src="image" mode="aspectFit" />
        <view v-else class="hlw-empty__icon i-fa6-solid-box-open" />
        <text class="hlw-empty__text">{{ text || "暂无数据" }}</text>
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * HlwEmpty — 空状态组件
 *
 * 用于页面或区域无数据时的占位展示，支持自定义提示文本和占位图片。
 *
 * @props
 *   text  - 占位提示文案，默认 "暂无数据"
 *   image - 占位图地址，未提供时默认渲染原生盒子 icon
 *
 * @example
 * ```vue
 * <HlwEmpty text="空空如也，快去添加内容吧" />
 * ```
 */
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
    color: #cbd5e1;
}

.hlw-empty__text {
    font-size: var(--font-base, 30rpx);
    color: #bbb;
}
</style>
