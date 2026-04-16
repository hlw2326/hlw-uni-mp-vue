<template>
    <view
        class="hlw-card"
        :class="[
            `hlw-card--radius-${radius}`,
            border ? 'hlw-card--bordered' : '',
        ]"
    >
        <!-- 头部 -->
        <view v-if="hasHeader" class="hlw-card-header">
            <slot name="header">
                <view class="hlw-card-header-inner">
                    <!-- 头部左侧 -->
                    <view class="hlw-card-header-left">
                        <slot name="header-left">
                            <text v-if="title" class="hlw-card-title">{{ title }}</text>
                        </slot>
                    </view>
                    <!-- 头部右侧 -->
                    <view v-if="$slots['header-right'] || extra" class="hlw-card-header-right">
                        <slot name="header-right">
                            <text v-if="extra" class="hlw-card-extra">{{ extra }}</text>
                        </slot>
                    </view>
                </view>
            </slot>
        </view>

        <!-- 头部虚线分隔 -->
        <view v-if="showDivider" class="hlw-card-divider"></view>

        <!-- 内容区 -->
        <view class="hlw-card-body" :class="{ 'hlw-card-body--padded': padding }">
            <slot></slot>
        </view>

        <!-- 底部 -->
        <view v-if="hasFooter" class="hlw-card-footer">
            <slot name="footer">
                <view class="hlw-card-footer-inner">
                    <view class="hlw-card-footer-left">
                        <slot name="footer-left"></slot>
                    </view>
                    <view v-if="$slots['footer-right']" class="hlw-card-footer-right">
                        <slot name="footer-right"></slot>
                    </view>
                </view>
            </slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

/**
 * hlw-card 卡片容器
 *
 * @example 基础用法
 * ```vue
 * <hlw-card title="标题" extra="更多">
 *   <text>内容</text>
 * </hlw-card>
 * ```
 *
 * @example 自定义头部左右
 * ```vue
 * <hlw-card>
 *   <template #header-left>
 *     <text>自定义左侧</text>
 *   </template>
 *   <template #header-right>
 *     <button>操作</button>
 *   </template>
 *   <text>内容</text>
 * </hlw-card>
 * ```
 *
 * @example 自定义底部
 * ```vue
 * <hlw-card title="标题">
 *   <text>内容</text>
 *   <template #footer-left>
 *     <text>左侧说明</text>
 *   </template>
 *   <template #footer-right>
 *     <button>确认</button>
 *   </template>
 * </hlw-card>
 * ```
 */
interface Props {
    /** 卡片标题 */
    title?: string;
    /** 头部右侧文字（无 header-right slot 时显示） */
    extra?: string;
    /** 是否显示边框，默认 true */
    border?: boolean;
    /** 圆角大小，对应 CSS 变量体系 */
    radius?: "none" | "sm" | "md" | "lg" | "xl";
    /** 头部与内容之间是否显示虚线分隔，有头部时默认 true */
    divider?: boolean;
    /** body 是否有内边距，默认 true */
    padding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "",
    extra: "",
    border: true,
    radius: "xl",
    divider: undefined,
    padding: true,
});

const slots = useSlots();

const hasHeader = computed(
    () => !!(props.title || props.extra || slots.header || slots["header-left"] || slots["header-right"]),
);

const hasFooter = computed(
    () => !!(slots.footer || slots["footer-left"] || slots["footer-right"]),
);

const showDivider = computed(() => {
    if (props.divider !== undefined) return props.divider;
    return hasHeader.value;
});
</script>

<style lang="scss" scoped>
.hlw-card {
    width: 100%;
    background: #fff;
    overflow: hidden;

    /* 圆角档位 */
    &--radius-none { border-radius: 0; }
    &--radius-sm   { border-radius: var(--radius-sm, 8rpx); }
    &--radius-md   { border-radius: var(--radius-md, 16rpx); }
    &--radius-lg   { border-radius: var(--radius-lg, 24rpx); }
    &--radius-xl   { border-radius: var(--radius-xl, 32rpx); }

    /* 边框 */
    &--bordered {
        border: 1rpx solid var(--border-color, #e2e8f0);
    }
}

/* 头部 */
.hlw-card-header {
    width: 100%;
}

.hlw-card-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 28rpx;
}

.hlw-card-header-left {
    flex: 1;
    min-width: 0;
}

.hlw-card-header-right {
    flex-shrink: 0;
    margin-left: 16rpx;
}

.hlw-card-title {
    font-size: var(--font-sm, 24rpx);
    font-weight: 700;
    color: #1e293b;
    letter-spacing: 0.02em;
}

.hlw-card-extra {
    font-size: var(--font-xs, 20rpx);
    color: #94a3b8;
}

/* 虚线分隔 */
.hlw-card-divider {
    width: 100%;
    border-bottom: 1rpx dashed var(--border-color, #e2e8f0);
}

/* 内容区 */
.hlw-card-body {
    width: 100%;

    &--padded {
        padding: 24rpx 28rpx;
    }
}

/* 底部 */
.hlw-card-footer {
    width: 100%;
    border-top: 1rpx solid var(--border-color-light, #f1f5f9);
}

.hlw-card-footer-inner {
    display: flex;
    align-items: center;
    padding: 20rpx 28rpx;
}

.hlw-card-footer-left {
    flex: 1;
    min-width: 0;
}

.hlw-card-footer-right {
    flex-shrink: 0;
    margin-left: 16rpx;
}
</style>
