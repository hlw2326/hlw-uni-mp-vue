<template>
    <button
        class="hlw-btn"
        :class="[
            `hlw-btn--${type}`,
            `hlw-btn--${size}`,
            { 'hlw-btn--block': block, 'hlw-btn--round': round, 'hlw-btn--disabled': disabled, 'hlw-btn--loading': loading },
        ]"
        :disabled="disabled || loading"
        :open-type="openType"
        @tap="$emit('click')"
    >
        <view v-if="loading" class="hlw-btn-spinner" />
        <view v-else-if="icon" :class="icon" class="hlw-btn-icon" />
        <slot />
    </button>
</template>

<script setup lang="ts">
/**
 * HlwButton — 主题按钮
 *
 * 跟随 --primary-color 主题色，支持多种类型、尺寸和状态。
 *
 * @props
 *   type     - 按钮类型：primary / outline / text / ghost，默认 primary
 *   size     - 尺寸：small / medium / large，默认 medium
 *   loading  - 加载状态（显示 spinner 并禁止点击），默认 false
 *   disabled - 禁用状态，默认 false
 *   block    - 块级按钮（占满父容器宽度），默认 false
 *   round    - 圆角药丸形状，默认 false
 *   icon     - 左侧图标 class（如 i-fa6-solid-plus）
 *   openType - 微信原生 open-type（如 share、getPhoneNumber）
 *
 * @events
 *   click - 点击事件
 *
 * @example
 * ```vue
 * <HlwButton type="primary" @click="submit">提交</HlwButton>
 * <HlwButton type="outline" loading>加载中</HlwButton>
 * <HlwButton type="text" icon="i-fa6-solid-plus">新增</HlwButton>
 * ```
 */
interface Props {
    type?: "primary" | "outline" | "text" | "ghost";
    size?: "small" | "medium" | "large";
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    round?: boolean;
    icon?: string;
    openType?: string;
}

withDefaults(defineProps<Props>(), {
    type: "primary",
    size: "medium",
    loading: false,
    disabled: false,
    block: false,
    round: false,
    icon: "",
    openType: "",
});

defineEmits<{ click: [] }>();
</script>

<style lang="scss" scoped>
.hlw-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    border: none;
    font-weight: 500;
    line-height: 1;
    transition: opacity 0.2s;

    &::after { display: none; }
    &:active { opacity: 0.7; }

    &--primary {
        background: var(--primary-color);
        color: #fff;
    }
    &--outline {
        background: transparent;
        color: var(--primary-color);
        border: 2rpx solid var(--primary-color);
    }
    &--text {
        background: transparent;
        color: var(--primary-color);
    }
    &--ghost {
        background: transparent;
        color: #fff;
        border: 2rpx solid rgba(255, 255, 255, 0.6);
    }

    &--small {
        padding: 8rpx 20rpx;
        font-size: var(--font-xs, 20rpx);
        border-radius: var(--radius-sm, 8rpx);
    }
    &--medium {
        padding: 16rpx 32rpx;
        font-size: var(--font-sm, 24rpx);
        border-radius: var(--radius-md, 16rpx);
    }
    &--large {
        padding: 24rpx 48rpx;
        font-size: var(--font-base, 28rpx);
        border-radius: var(--radius-md, 16rpx);
    }

    &--block { display: flex; width: 100%; }
    &--round { border-radius: 999rpx; }
    &--disabled { opacity: 0.4; &:active { opacity: 0.4; } }
    &--loading { opacity: 0.7; }
}

.hlw-btn-icon {
    font-size: 1.1em;
}

.hlw-btn-spinner {
    width: 28rpx;
    height: 28rpx;
    border: 3rpx solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: hlw-spin 0.6s linear infinite;
}

@keyframes hlw-spin {
    to { transform: rotate(360deg); }
}
</style>
