<template>
    <view v-if="mounted" class="hlw-notice-mask" :class="{ 'hlw-notice-mask--in': visible }" @tap.self>
        <view class="hlw-notice-card" :class="{ 'hlw-notice-card--in': visible }" @tap.stop>
            <view class="hlw-notice-head">
                <view class="hlw-notice-icon" :style="{ background: iconTint }">
                    <view class="hlw-notice-icon-i" :class="iconClass" :style="{ color: iconColor }" />
                </view>
                <text class="hlw-notice-title">{{ title }}</text>
            </view>

            <scroll-view
                class="hlw-notice-body"
                scroll-y
                :show-scrollbar="false"
                :enhanced="true"
            >
                <rich-text class="hlw-notice-text" :nodes="contentNodes" />
            </scroll-view>

            <view
                class="hlw-notice-btn"
                :style="{ background: iconColor }"
                hover-class="hlw-notice-btn--hover"
                @tap="onConfirm"
            >
                <text class="hlw-notice-btn-text">{{ confirmText }}</text>
            </view>

            <view
                v-if="showCancel"
                class="hlw-notice-dismiss"
                hover-class="hlw-notice-dismiss--hover"
                @tap="onCancel"
            >
                <text class="hlw-notice-dismiss-text">{{ cancelText }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

interface Props {
    show?: boolean;
    title?: string;
    /** 内容：HTML 原样渲染，纯文本自动 \n -> <br/> */
    content?: string;
    /** iconify class，例：i-fa6-solid-bell */
    iconClass?: string;
    /** 图标 + 主按钮颜色 */
    iconColor?: string;
    /** 图标背景色 */
    iconTint?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    /** 进出场动画时长（ms），需与 CSS transition 一致 */
    animMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    title: "",
    content: "",
    iconClass: "i-fa6-solid-bell",
    iconColor: "#1C1C1E",
    iconTint: "#F2F2F7",
    confirmText: "我知道了",
    cancelText: "稍后再看",
    showCancel: false,
    animMs: 260,
});

const emit = defineEmits<{ confirm: []; cancel: [] }>();

const mounted = ref(false);
const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const contentNodes = computed(() => {
    const raw = props.content;
    return /<[a-z][\s\S]*>/i.test(raw) ? raw : raw.replace(/\n/g, "<br/>");
});

watch(
    () => props.show,
    async (next) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        if (next) {
            mounted.value = true;
            await nextTick();
            visible.value = true;
        } else {
            visible.value = false;
            timer = setTimeout(() => {
                mounted.value = false;
                timer = null;
            }, props.animMs);
        }
    },
    { immediate: true },
);

function onConfirm() {
    emit("confirm");
}

function onCancel() {
    emit("cancel");
}
</script>

<style lang="scss" scoped>
.hlw-notice-mask {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    background: rgba(0, 0, 0, 0);
    transition: background 0.25s ease-out;

    &--in {
        background: rgba(0, 0, 0, 0.4);
    }
}

.hlw-notice-card {
    width: 100%;
    max-width: 540rpx;
    background: var(--surface-card, #ffffff);
    border-radius: var(--radius-xl, 36rpx);
    padding: 40rpx 36rpx 32rpx;
    box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.1);
    transform: scale(0.92);
    opacity: 0;
    transition: transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.22s ease-out;

    &--in {
        transform: scale(1);
        opacity: 1;
    }
}

.hlw-notice-head {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    margin-bottom: 24rpx;
}

.hlw-notice-icon {
    width: 48rpx;
    height: 48rpx;
    border-radius: var(--radius-sm, 12rpx);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.hlw-notice-icon-i {
    font-size: 24rpx;
}

.hlw-notice-title {
    font-size: var(--font-md, 30rpx);
    font-weight: 700;
    color: var(--text-primary, #1c1c1e);
    line-height: 1.3;
    word-break: break-word;
}

.hlw-notice-body {
    width: 100%;
    max-height: 560rpx;
    margin-bottom: 36rpx;
    padding-right: 6rpx;
}

.hlw-notice-text {
    display: block;
    font-size: var(--font-sm, 26rpx);
    line-height: 1.65;
    color: var(--text-secondary, #5c5c5e);
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
}

.hlw-notice-btn {
    width: 100%;
    padding: 22rpx 0;
    border-radius: 9999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: transform 0.15s ease-out, filter 0.15s ease-out;

    &--hover {
        transform: scale(0.97);
        filter: brightness(0.92);
    }
}

.hlw-notice-btn-text {
    color: #ffffff;
    font-size: var(--font-base, 28rpx);
    font-weight: 600;
    letter-spacing: 1rpx;
}

.hlw-notice-dismiss {
    margin-top: 16rpx;
    padding: 10rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &--hover {
        opacity: 0.5;
    }
}

.hlw-notice-dismiss-text {
    font-size: var(--font-xs, 24rpx);
    color: var(--text-muted, #8e8e93);
    font-weight: 500;
}
</style>
