<template>
    <button
        class="hlw-btn"
        :class="[
            `hlw-btn--${props.type}`,
            `hlw-btn--${props.size}`,
            {
                'hlw-btn--block': props.block,
                'hlw-btn--round': props.round,
                'hlw-btn--disabled': props.disabled,
                'hlw-btn--loading': props.loading,
            },
        ]"
        :style="buttonStyle"
        :disabled="props.disabled || props.loading"
        :open-type="props.openType"
        @tap="handleTap"
    >
        <view v-if="props.loading" class="hlw-btn-spinner" />
        <template v-else>
            <view v-if="hasIcon" class="hlw-btn-icon-wrap">
                <slot name="icon">
                    <view v-if="props.icon" :class="props.icon" class="hlw-btn-icon" />
                </slot>
            </view>
            <view class="hlw-btn-content">
                <slot />
            </view>
        </template>
    </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

type ButtonType =
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "error"
    | "info"
    | "outline"
    | "text"
    | "ghost";

type NavigateType = "navigateTo" | "redirectTo" | "switchTab" | "reLaunch" | "navigateBack";

interface Props {
    type?: ButtonType;
    size?: "small" | "medium" | "large";
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    round?: boolean;
    icon?: string;
    openType?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    url?: string;
    navigateType?: NavigateType;
    delta?: number;
}

const props = withDefaults(defineProps<Props>(), {
    type: "primary",
    size: "medium",
    loading: false,
    disabled: false,
    block: false,
    round: false,
    icon: "",
    openType: "",
    bgColor: "",
    textColor: "",
    borderColor: "",
    url: "",
    navigateType: "navigateTo",
    delta: 1,
});

const emit = defineEmits<{ click: [] }>();

const slots = useSlots();
const hasIcon = computed(() => Boolean(props.icon || slots.icon));

const buttonStyle = computed(() => {
    const style: Record<string, string> = {};

    if (props.bgColor) style.background = props.bgColor;
    if (props.textColor) style.color = props.textColor;
    if (props.borderColor) style.borderColor = props.borderColor;

    return style;
});

const handleTap = () => {
    if (props.disabled || props.loading) return;

    emit("click");

    if (!props.url && props.navigateType !== "navigateBack") return;

    switch (props.navigateType) {
        case "redirectTo":
            if (props.url) uni.redirectTo({ url: props.url });
            break;
        case "switchTab":
            if (props.url) uni.switchTab({ url: props.url });
            break;
        case "reLaunch":
            if (props.url) uni.reLaunch({ url: props.url });
            break;
        case "navigateBack":
            uni.navigateBack({ delta: props.delta });
            break;
        default:
            if (props.url) uni.navigateTo({ url: props.url });
            break;
    }
};
</script>

<style lang="scss" scoped>
$semantic-colors: (
    primary: var(--primary-color),
    success: #10b981,
    warning: #f59e0b,
    danger: #ef4444,
    error: #ef4444,
    info: #64748b,
);

.hlw-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    flex-shrink: 0;
    border: none;
    font-weight: 500;
    line-height: 1;
    transition: opacity 0.2s;
    box-sizing: border-box;
    background: transparent;
    white-space: nowrap;

    &::after {
        display: none;
    }

    &:active {
        opacity: 0.7;
    }

    @each $name, $color in $semantic-colors {
        &--#{$name} {
            background: #{$color};
            color: #fff;
            border: none;
        }
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
        min-height: 56rpx;
        padding: 12rpx 20rpx;
        font-size: var(--font-xs, 20rpx);
        border-radius: var(--radius-sm, 8rpx);
    }

    &--medium {
        min-height: 72rpx;
        padding: 18rpx 32rpx;
        font-size: var(--font-sm, 24rpx);
        border-radius: var(--radius-md, 16rpx);
    }

    &--large {
        min-height: 88rpx;
        padding: 22rpx 48rpx;
        font-size: var(--font-base, 28rpx);
        border-radius: var(--radius-md, 16rpx);
    }

    &--block {
        display: flex;
        width: 100%;
    }

    &--round {
        border-radius: 999rpx;
    }

    &--disabled {
        opacity: 0.4;

        &:active {
            opacity: 0.4;
        }
    }

    &--loading {
        opacity: 0.7;
    }
}

.hlw-btn-icon-wrap,
.hlw-btn-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
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
    to {
        transform: rotate(360deg);
    }
}
</style>
