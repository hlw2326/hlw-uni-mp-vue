<template>
    <view
        class="hlw-tag"
        :class="[`hlw-tag--${type}`, `hlw-tag--${size}`, { 'hlw-tag--plain': plain, 'hlw-tag--round': round }]"
        :style="customStyle"
        @tap="$emit('click')"
    >
        <text class="hlw-tag-text"><slot /></text>
        <view v-if="closable" class="hlw-tag-close i-fa6-solid-xmark" @tap.stop="$emit('close')" />
    </view>
</template>

<script setup lang="ts">
/**
 * HlwTag — 轻量徽标标签组件
 *
 * 适用于标记状态、商品分类、分类标签等，支持多种色彩类型、镂空样式、圆角胶囊轮廓及可关闭动作。
 *
 * @props
 *   type     - 标签色彩类型：primary / success / warning / danger / error / info，默认 primary
 *   plain    - 是否为镂空样式，默认 false
 *   closable - 是否为可关闭标签（右侧展示 X 关闭按钮），默认 false
 *   size     - 尺寸大小：small / medium，默认 medium
 *   round    - 是否为圆角胶囊形状，默认 false
 *   color    - 自定义背景与边框颜色（覆盖 type 样式）
 *
 * @events
 *   click - 点击标签时触发
 *   close - 点击关闭按钮时触发
 *
 * @example
 * ```vue
 * <HlwTag type="success" plain round>已发货</HlwTag>
 * ```
 */
import { computed } from "vue";

interface Props {
    type?: "primary" | "success" | "warning" | "danger" | "error" | "info";
    plain?: boolean;
    closable?: boolean;
    size?: "small" | "medium";
    round?: boolean;
    color?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "primary",
    plain: false,
    closable: false,
    size: "medium",
    round: false,
    color: "",
});

defineEmits<{ click: []; close: [] }>();

const customStyle = computed(() => {
    if (!props.color) return {};
    return props.plain
        ? { color: props.color, borderColor: props.color, background: "transparent" }
        : { background: props.color, color: "#fff", borderColor: props.color };
});
</script>

<style lang="scss" scoped>
$colors: (
    primary: var(--primary-color, #3b82f6),
    success: var(--primary-success, #10b981),
    warning: var(--primary-warning, #f59e0b),
    danger: var(--primary-error, #ef4444),
    error: var(--primary-error, #ef4444),
    info: var(--primary-info, #64748b),
);

.hlw-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    gap: 4rpx;
    font-weight: 500;
    line-height: 1.2;
    border: 2rpx solid transparent;
    box-sizing: border-box;

    &--medium {
        min-height: 36rpx;
        padding: 4rpx 16rpx;
        font-size: var(--font-xs, 20rpx);
        border-radius: var(--radius-sm, 8rpx);
    }

    &--small {
        min-height: 28rpx;
        padding: 2rpx 10rpx;
        font-size: 18rpx;
        border-radius: 6rpx;
    }

    &--round { border-radius: 999rpx; }

    @each $name, $c in $colors {
        &--#{$name} { background: #{$c}; color: #fff; border-color: #{$c}; }
        &--#{$name}.hlw-tag--plain { background: transparent; color: #{$c}; }
    }
}

.hlw-tag-text {
    display: block;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    line-height: 1.2;
}

.hlw-tag-close {
    font-size: 1em;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 2rpx;
    opacity: 0.8;
}
</style>
