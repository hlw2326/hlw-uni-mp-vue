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
        :send-message-title="props.sendMessageTitle || undefined"
        :send-message-path="props.sendMessagePath || undefined"
        :send-message-img="props.sendMessageImg || undefined"
        :show-message-card="props.showMessageCard"
        @tap="handleTap"
    >
        <view v-if="props.loading" class="hlw-btn-spinner" />
        <template v-else>
            <view v-if="hasIcon" class="hlw-btn-icon-wrap">
                <slot name="icon">
                    <view v-if="props.icon" :class="props.icon" class="hlw-btn-icon" />
                </slot>
            </view>
            <view v-if="hasContent" class="hlw-btn-content">
                <slot />
            </view>
        </template>
    </button>
</template>

<script setup lang="ts">
/**
 * HlwButton - 语义化/响应式通用按钮组件
 * 
 * 扩展了原生小程序 button 属性。支持丰富的语义色彩预设、尺寸自适应、圆角与 Block 状态，
 * 并且内置了快捷的 uni-app 路由跳转逻辑与 Native `open-type` 会话消息配置。
 */
import { computed, useSlots } from "vue";
import { useNavigate } from "@/composables/navigator";

/** 按钮类型：语义化颜色预设、边框模式、文本模式及幽灵模式 */
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

/** 路由动作类型 */
type NavigateType = "navigateTo" | "redirectTo" | "switchTab" | "reLaunch" | "navigateBack";

interface Props {
    /** 按钮类型 */
    type?: ButtonType;
    /** 按钮尺寸大小 */
    size?: "small" | "medium" | "large";
    /** 是否开启 Loading 载入状态，开启后按钮处于禁用状态且显示菊花加载器 */
    loading?: boolean;
    /** 是否禁用按钮 */
    disabled?: boolean;
    /** 是否独占整行（宽 100%） */
    block?: boolean;
    /** 是否为椭圆胶囊形状（圆角为 999rpx） */
    round?: boolean;
    /** 图标的 class 名称，若传入则在按钮内容前展示 */
    icon?: string;
    /** 小程序原生的开放能力类型（如：share, contact, getUserInfo...） */
    openType?: string;
    /** 自定义背景颜色（覆盖 type 预设） */
    bgColor?: string;
    /** 自定义文字颜色（覆盖 type 预设） */
    textColor?: string;
    /** 自定义边框颜色（覆盖 type 预设） */
    borderColor?: string;
    /** 快捷跳转的目标路径 */
    url?: string;
    /** 路由动作方式，默认 navigateTo */
    navigateType?: NavigateType;
    /** 返回上级页面的层数，仅在 navigateType="navigateBack" 时有效 */
    delta?: number;
    /** open-type="contact" 时：用户进入会话时展示的自定义消息卡片标题 */
    sendMessageTitle?: string;
    /** open-type="contact" 时：消息卡片跳转的页面路径（/ 开头） */
    sendMessagePath?: string;
    /** open-type="contact" 时：消息卡片缩略图 URL */
    sendMessageImg?: string;
    /** open-type="contact" 时：是否显示会话内的消息卡片（默认 false） */
    showMessageCard?: boolean;
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
    sendMessageTitle: "",
    sendMessagePath: "",
    sendMessageImg: "",
    showMessageCard: false,
});

const emit = defineEmits<{
    /** 按钮点击事件（在未禁用且非 loading 时触发） */
    click: []
}>();

const slots = useSlots();
const hasIcon = computed(() => Boolean(props.icon || slots.icon));

/**
 * 默认 slot 是否有内容，用于避免空 slot 占位影响 flex 布局。
 * 小程序 Vue runtime 的 VNode 结构与标准 Vue 不同，这里仅检测 slot 函数是否存在 —
 * `<hlw-button />` 自闭合时 slots.default 为 undefined；有任何 slot 内容（含 `<hlw-button></hlw-button>` 之外）时为函数。
 */
const hasContent = computed(() => Boolean(slots.default));

const buttonStyle = computed(() => {
    const style: Record<string, string> = {};

    if (props.bgColor) style.background = props.bgColor;
    if (props.textColor) style.color = props.textColor;
    if (props.borderColor) style.borderColor = props.borderColor;

    return style;
});

const navigator = useNavigate();

/**
 * 处理点击事件与快捷页面跳转。
 */
const handleTap = () => {
    if (props.disabled || props.loading) return;

    emit("click");

    if (!props.url && props.navigateType !== "navigateBack") return;

    navigator.navigate(props.navigateType, props.url, { delta: props.delta });
};
</script>

<style lang="scss" scoped>
$semantic-colors: (
    primary: var(--primary-color, #3b82f6),
    success: var(--primary-success, #10b981),
    warning: var(--primary-warning, #f59e0b),
    danger: var(--primary-error, #ef4444),
    error: var(--primary-error, #ef4444),
    info: var(--primary-info, #64748b),
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
