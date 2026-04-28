<template>
    <view
        class="hlw-card-header"
        :class="{ 'hlw-card-header--divider': divider }"
    >
        <view class="hlw-card-header__left">
            <slot name="left">
                <text v-if="icon" class="hlw-card-header__icon" :class="icon" />
                <text v-if="title" class="hlw-card-header__title">{{ title }}</text>
            </slot>
        </view>
        <view v-if="hasRight" class="hlw-card-header__right">
            <slot name="right">
                <text v-if="extra" class="hlw-card-header__extra">{{ extra }}</text>
            </slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

/**
 * hlw-card-header — 卡片头部独立组件
 *
 * 三种用法：
 *
 * @example A. 直接当 <hlw-card> 的 default slot 子元素（注意把 hlw-card 的 padding 关掉，否则会双重 padding）
 * ```vue
 * <hlw-card :padding="false">
 *     <hlw-card-header title="标题" icon="i-fa6-solid-heart-pulse text-rose-500" extra="副标题" />
 *     <view style="padding: 24rpx 28rpx">body</view>
 * </hlw-card>
 * ```
 *
 * @example B. 放进 <hlw-card> 的 #header slot（保留 body 默认 padding）
 * ```vue
 * <hlw-card>
 *     <template #header>
 *         <hlw-card-header title="标题" icon="i-fa6-solid-star" extra="副标题" />
 *     </template>
 *     body
 * </hlw-card>
 * ```
 *
 * @example C. 完全独立（不必嵌在 hlw-card 里）
 * ```vue
 * <hlw-card-header title="独立标题">
 *     <template #right><button>操作</button></template>
 * </hlw-card-header>
 * ```
 */
interface Props {
    /** 标题文字 */
    title?: string;
    /** 图标 class（iconify 或自定义），如 `"i-fa6-solid-heart-pulse text-rose-500"` */
    icon?: string;
    /** 右侧附加文字（无 right slot 时显示） */
    extra?: string;
    /** 是否在头部底部显示虚线分隔线，默认 false。线型由 CSS 变量 `--card-header-divider-style`（默认 dashed）控制 */
    divider?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "",
    icon: "",
    extra: "",
    divider: false,
});

const slots = useSlots();

const hasRight = computed(() => !!(slots.right || props.extra));

defineOptions({
    name: "HlwCardHeader",
});
</script>

<style lang="scss" scoped>
.hlw-card-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 28rpx;
    box-sizing: border-box;

    &--divider {
        border-bottom:
            var(--card-header-divider-width, 1rpx)
            var(--card-header-divider-style, dashed)
            var(--card-header-divider-color, var(--border-color, #e2e8f0));
    }
}

.hlw-card-header__left {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.hlw-card-header__right {
    flex-shrink: 0;
    margin-left: 16rpx;
}

.hlw-card-header__icon {
    font-size: var(--font-base, 28rpx);
}

.hlw-card-header__title {
    font-size: var(--font-sm, 24rpx);
    font-weight: 700;
    color: var(--text-primary, #1e293b);
    letter-spacing: 0.02em;
}

.hlw-card-header__extra {
    font-size: var(--font-xs, 20rpx);
    color: var(--text-subtle, #94a3b8);
}
</style>
