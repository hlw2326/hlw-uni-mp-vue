<template>
    <view
        class="hlw-card-header"
        :class="{ 'hlw-card-header--divider': divider }"
        :style="headerStyle"
    >
        <view class="hlw-card-header__left">
            <slot name="left">
                <view v-if="icon" class="hlw-card-header__icon-box" :class="iconBoxClass">
                    <text class="hlw-card-header__icon" :class="icon" />
                </view>
                <text v-if="title" class="hlw-card-header__title" :style="titleStyle">{{ title }}</text>
            </slot>
        </view>
        <view v-if="hasRight" class="hlw-card-header__right">
            <slot name="right">
                <text v-if="descText" class="hlw-card-header__desc" :style="descStyle">{{ descText }}</text>
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
 *     <hlw-card-header title="标题" icon="i-fa6-solid-heart-pulse text-rose-500" desc="副标题" />
 *     <view style="padding: 24rpx 28rpx">body</view>
 * </hlw-card>
 * ```
 *
 * @example B. 放进 <hlw-card> 的 #header slot（保留 body 默认 padding）
 * ```vue
 * <hlw-card>
 *     <template #header>
 *         <hlw-card-header title="标题" icon="i-fa6-solid-star" desc="副标题" />
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
    /** 右侧描述文字（无 right slot 时显示） */
    desc?: string;
    /** @deprecated 请使用 desc */
    extra?: string;
    /** 标题字号，支持 CSS 变量，如 `var(--font-md)` */
    titleSize?: string;
    /** 标题颜色 */
    titleColor?: string;
    /** 标题字重 */
    titleWeight?: string | number;
    /** 描述字号，支持 CSS 变量，如 `var(--font-xs)` */
    descSize?: string;
    /** 描述颜色 */
    descColor?: string;
    /** 描述字重 */
    descWeight?: string | number;
    /** 是否在头部底部显示虚线分隔线，默认 false。线型由 CSS 变量 `--card-header-divider-style`（默认 dashed）控制 */
    divider?: boolean;
    /** 头部背景色，如 `#f8fafc` / `rgba(248, 250, 252, 0.3)` */
    bgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: "",
    icon: "",
    desc: "",
    extra: "",
    titleSize: "var(--font-30)",
    titleColor: "",
    titleWeight: "",
    descSize: "var(--font-sm)",
    descColor: "",
    descWeight: "",
    divider: false,
    bgColor: "",
});

const slots = useSlots();

const descText = computed(() => props.desc || props.extra);

const hasRight = computed(() => !!(slots.right || descText.value));

const headerStyle = computed(() => (props.bgColor ? { backgroundColor: props.bgColor } : {}));

const titleStyle = computed(() => ({
    fontSize: props.titleSize,
    ...(props.titleColor ? { color: props.titleColor } : {}),
    ...(props.titleWeight ? { fontWeight: String(props.titleWeight) } : {}),
}));

const descStyle = computed(() => ({
    fontSize: props.descSize,
    ...(props.descColor ? { color: props.descColor } : {}),
    ...(props.descWeight ? { fontWeight: String(props.descWeight) } : {}),
}));

const iconToneClass = computed(() => {
    const value = props.icon;
    if (value.includes("text-rose") || value.includes("text-red")) return "rose";
    if (value.includes("text-emerald") || value.includes("text-green")) return "emerald";
    if (value.includes("text-blue")) return "blue";
    if (value.includes("text-sky")) return "sky";
    if (value.includes("text-cyan")) return "cyan";
    if (value.includes("text-purple")) return "purple";
    if (value.includes("text-pink")) return "pink";
    if (value.includes("text-yellow") || value.includes("text-amber")) return "amber";
    return "indigo";
});

const iconBoxClass = computed(() => `hlw-card-header__icon-box--${iconToneClass.value}`);

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
    padding: 26rpx 26rpx;
    box-sizing: border-box;

}

.hlw-card-header__left {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.hlw-card-header__right {
    flex-shrink: 0;
    margin-left: 16rpx;
}

.hlw-card-header__icon-box {
    flex-shrink: 0;
    width: 56rpx;
    height: 56rpx;
    border-radius: var(--radius-md, 16rpx);
    display: flex;
    align-items: center;
    justify-content: center;

    &--indigo {
        background: #eef2ff;
    }

    &--rose {
        background: #fff1f2;
    }

    &--emerald {
        background: #ecfdf5;
    }

    &--blue {
        background: #eff6ff;
    }

    &--sky {
        background: #f0f9ff;
    }

    &--cyan {
        background: #ecfeff;
    }

    &--purple {
        background: #faf5ff;
    }

    &--pink {
        background: #fdf2f8;
    }

    &--amber {
        background: #fffbeb;
    }
}

.hlw-card-header__icon {
    font-size: var(--font-xs);
}

.hlw-card-header__title {
    font-size: var(--font-base);
    font-weight: 500;
    color: var(--text-primary, #1e293b);
    letter-spacing: 1rpx;   
}

.hlw-card-header__desc {
    padding: 8rpx 16rpx;
    border-radius: var(--radius-sm, 8rpx);
    background: rgba(241, 245, 249, 0.8);
    color: var(--text-muted, #64748b);
    font-size: var(--font-sm);
    letter-spacing: 3rpx;
}
</style>
