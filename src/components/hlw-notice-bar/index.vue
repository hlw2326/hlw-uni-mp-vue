<template>
    <view v-if="!closed" class="hlw-notice" :style="{ color, background }">
        <view v-if="leftIcon" :class="leftIcon" class="hlw-notice-left-icon" />
        <view v-else class="hlw-notice-left-icon i-fa6-solid-bullhorn" />
        <view class="hlw-notice-wrap" @tap="$emit('click')">
            <view v-if="scrollable" class="hlw-notice-scroll" :style="animStyle">
                <text class="hlw-notice-text">{{ text }}</text>
            </view>
            <text v-else class="hlw-notice-text hlw-notice-text--ellipsis">{{ text }}</text>
        </view>
        <view v-if="closable" class="hlw-notice-close i-fa6-solid-xmark" @tap="onClose" />
    </view>
</template>

<script setup lang="ts">
/**
 * HlwNoticeBar — 滚动通告栏
 *
 * 用于显示重要广播、紧急通告或系统消息。支持横向无缝滚动播放、可关闭状态及自定义图标/色彩。
 *
 * @props
 *   text       - 通告文本内容
 *   scrollable - 是否开启滚动播放，默认 true
 *   closable   - 是否显示关闭按钮，默认 false
 *   color      - 文字颜色，默认 "#ed6a0c"
 *   background - 背景颜色，默认 "#fffbe8"
 *   speed      - 滚动速度（每秒像素数），默认 60
 *   leftIcon   - 左侧自定义图标 class，默认喇叭图标
 *
 * @events
 *   close - 点击关闭按钮时触发
 *   click - 点击通告内容区时触发
 *
 * @example
 * ```vue
 * <HlwNoticeBar text="系统将于今晚24点停机维护，给您带来的不便敬请谅解！" closable />
 * ```
 */
import { computed, ref } from "vue";

interface Props {
    text?: string;
    scrollable?: boolean;
    closable?: boolean;
    color?: string;
    background?: string;
    speed?: number;
    leftIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    text: "",
    scrollable: true,
    closable: false,
    color: "#ed6a0c",
    background: "#fffbe8",
    speed: 60,
    leftIcon: "",
});

defineEmits<{ close: []; click: [] }>();

const closed = ref(false);
const duration = computed(() => Math.max(3, (props.text.length * 20) / props.speed));
const animStyle = computed(() => ({ animationDuration: `${duration.value}s` }));

function onClose() {
    closed.value = true;
}
</script>

<style lang="scss" scoped>
.hlw-notice {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx;
    gap: 12rpx;
    font-size: var(--font-sm, 26rpx);
}

.hlw-notice-left-icon {
    flex-shrink: 0;
    font-size: var(--font-base, 30rpx);
}

.hlw-notice-wrap {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
}

.hlw-notice-scroll {
    display: inline-block;
    white-space: nowrap;
    animation: hlw-notice-scroll linear infinite;
    padding-left: 100%;
}

.hlw-notice-text {
    display: inline;
}

.hlw-notice-text--ellipsis {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hlw-notice-close {
    flex-shrink: 0;
    font-size: var(--font-base, 30rpx);
    line-height: 1;
    opacity: 0.6;
    padding: 4rpx;
}

@keyframes hlw-notice-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}
</style>
