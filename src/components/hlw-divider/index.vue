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
/**
 * HlwDivider — 分割线
 *
 * 水平分割线，可带文字说明，支持虚线和文字位置调整。
 *
 * @props
 *   text     - 分割线中间文字
 *   position - 文字位置：left / center / right，默认 center
 *   dashed   - 是否虚线，默认 false
 *
 * @slots
 *   default - 自定义分割线中间内容（覆盖 text）
 *
 * @example
 * ```vue
 * <HlwDivider />
 * <HlwDivider text="或" />
 * <HlwDivider text="更多" position="left" dashed />
 * ```
 */
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
