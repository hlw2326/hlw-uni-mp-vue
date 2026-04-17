<template>
    <view v-if="show" class="hlw-popup-mask" @tap.self="onClose" />
    <view class="hlw-popup" :class="[`hlw-popup--${position}`, { 'hlw-popup--show': show, 'hlw-popup--round': round }]">
        <view v-if="title || closable" class="hlw-popup-header">
            <text class="hlw-popup-title">{{ title }}</text>
            <view v-if="closable" class="hlw-popup-close" @tap="onClose">&#215;</view>
        </view>
        <slot />
    </view>
</template>

<script setup lang="ts">
interface Props {
    show?: boolean;
    position?: "bottom" | "center" | "top";
    round?: boolean;
    closable?: boolean;
    title?: string;
}

withDefaults(defineProps<Props>(), {
    show: false,
    position: "bottom",
    round: true,
    closable: true,
    title: "",
});

const emit = defineEmits<{ "update:show": [value: boolean]; close: [] }>();

function onClose() {
    emit("update:show", false);
    emit("close");
}
</script>

<style lang="scss" scoped>
.hlw-popup-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: hlw-fade-in 0.25s;
}

.hlw-popup {
    position: fixed;
    z-index: 1001;
    background: #fff;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &--bottom {
        left: 0;
        right: 0;
        bottom: 0;
        max-height: 80vh;
        transform: translateY(100%);
        &.hlw-popup--show { transform: translateY(0); }
        &.hlw-popup--round { border-radius: var(--radius-xl, 32rpx) var(--radius-xl, 32rpx) 0 0; }
    }

    &--top {
        left: 0;
        right: 0;
        top: 0;
        max-height: 80vh;
        transform: translateY(-100%);
        &.hlw-popup--show { transform: translateY(0); }
        &.hlw-popup--round { border-radius: 0 0 var(--radius-xl, 32rpx) var(--radius-xl, 32rpx); }
    }

    &--center {
        left: 50%;
        top: 50%;
        width: 80%;
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
        border-radius: var(--radius-xl, 32rpx);
        &.hlw-popup--show { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
}

.hlw-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid var(--border-color-light, #f1f5f9);
}

.hlw-popup-title {
    font-size: var(--font-md, 32rpx);
    font-weight: 600;
    color: #1e293b;
}

.hlw-popup-close {
    font-size: 40rpx;
    color: #94a3b8;
    line-height: 1;
    padding: 0 8rpx;
}

@keyframes hlw-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
