<template>
    <view v-if="show" class="hlw-modal-mask" @tap.self="onMask">
        <view class="hlw-modal" :class="{ 'hlw-modal--show': show }" @tap.stop>
            <view v-if="title" class="hlw-modal-title">{{ title }}</view>
            <view class="hlw-modal-body" :style="{ padding: props.bodyPadding }">
                <slot />
            </view>
            <slot name="footer">
                <view class="hlw-modal-footer">
                    <view
                        v-if="showCancel"
                        class="hlw-modal-btn hlw-modal-btn--cancel"
                        @tap.stop="onCancel"
                    >
                        {{ cancelText }}
                    </view>
                    <view class="hlw-modal-btn hlw-modal-btn--confirm" @tap.stop="onConfirm">
                        {{ confirmText }}
                    </view>
                </view>
            </slot>
        </view>
    </view>
</template>

<script setup lang="ts">
interface Props {
    show?: boolean;
    title?: string;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
    closeOnMask?: boolean;
    /** 内容区内边距。默认 `32rpx`，需要自定义内容贴边时传 `"0"` */
    bodyPadding?: string;
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    title: "",
    showCancel: true,
    confirmText: "确定",
    cancelText: "取消",
    closeOnMask: true,
    bodyPadding: "32rpx",
});

const emit = defineEmits<{ "update:show": [value: boolean]; confirm: []; cancel: [] }>();

function close() {
    emit("update:show", false);
}

function onMask() {
    if (!props.closeOnMask) return;
    close();
}

function onConfirm() {
    emit("confirm");
    close();
}

function onCancel() {
    emit("cancel");
    close();
}
</script>

<style lang="scss" scoped>
.hlw-modal-mask {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: hlw-fade-in 0.2s;
}

.hlw-modal {
    width: 80%;
    max-width: 600rpx;
    background: #fff;
    border-radius: var(--radius-xl, 32rpx);
    overflow: hidden;
    animation: hlw-scale-in 0.25s ease;
}

.hlw-modal-title {
    padding: 40rpx 32rpx 0;
    text-align: center;
    font-size: var(--font-md, 32rpx);
    font-weight: 600;
    color: #1e293b;
}

.hlw-modal-body {
    font-size: var(--font-base, 28rpx);
    color: #475569;
    text-align: center;
    line-height: 1.6;
}

.hlw-modal-footer {
    display: flex;
    border-top: 1rpx solid var(--border-color-light, #f1f5f9);
}

.hlw-modal-btn {
    flex: 1;
    padding: 24rpx 0;
    text-align: center;
    font-size: var(--font-base, 28rpx);
    font-weight: 500;

    &:active { background: #f8fafc; }

    &--cancel {
        color: #64748b;
        border-right: 1rpx solid var(--border-color-light, #f1f5f9);
    }

    &--confirm {
        color: var(--primary-color, #3b82f6);
    }
}

@keyframes hlw-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes hlw-scale-in {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
</style>
