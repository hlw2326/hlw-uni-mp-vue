<template>
    <view
        class="hlw-tag"
        :class="[`hlw-tag--${type}`, `hlw-tag--${size}`, { 'hlw-tag--plain': plain, 'hlw-tag--round': round }]"
        :style="customStyle"
        @tap="$emit('click')"
    >
        <slot />
        <view v-if="closable" class="hlw-tag-close i-fa6-solid-xmark" @tap.stop="$emit('close')" />
    </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
    type?: "primary" | "success" | "warning" | "danger" | "info";
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
    success: #10b981,
    warning: #f59e0b,
    danger: #ef4444,
    info: #64748b,
);

.hlw-tag {
    display: inline-flex;
    align-items: center;
    gap: 4rpx;
    font-weight: 500;
    border: 2rpx solid transparent;

    &--medium { padding: 4rpx 16rpx; font-size: var(--font-xs, 20rpx); border-radius: var(--radius-sm, 8rpx); }
    &--small { padding: 2rpx 10rpx; font-size: 18rpx; border-radius: 6rpx; }
    &--round { border-radius: 999rpx; }

    @each $name, $c in $colors {
        &--#{$name} { background: #{$c}; color: #fff; border-color: #{$c}; }
        &--#{$name}.hlw-tag--plain { background: transparent; color: #{$c}; }
    }
}

.hlw-tag-close {
    font-size: 1em;
    line-height: 1;
    margin-left: 2rpx;
    opacity: 0.8;
}
</style>
