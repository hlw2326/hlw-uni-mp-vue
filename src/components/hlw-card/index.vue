<template>
    <view
        class="hlw-card"
        :class="[
            `hlw-card--radius-${radius}`,
            ...borderClasses,
        ]"
        :style="rootStyle"
    >
        <!-- 头部 — 用 #header slot 自定义；常规场景请用 <hlw-card-header> -->
        <view v-if="hasHeader" class="hlw-card-header">
            <slot name="header" />
        </view>

        <!-- 头部虚线分隔（有 #header slot 且 divider != false 时显示） -->
        <view v-if="showDivider" class="hlw-card-divider" />

        <!-- 内容区 -->
        <view class="hlw-card-body" :class="{ 'hlw-card-body--padded': padding }">
            <slot />
        </view>

        <!-- 底部 -->
        <view v-if="hasFooter" class="hlw-card-footer">
            <slot name="footer">
                <view class="hlw-card-footer-inner">
                    <view class="hlw-card-footer-left">
                        <slot name="footer-left" />
                    </view>
                    <view v-if="$slots['footer-right']" class="hlw-card-footer-right">
                        <slot name="footer-right" />
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
 * 头部用法已迁出：常规标题 + 副标题请用 <hlw-card-header>，写在 default slot 里
 * （记得 :padding="false" 避免 body padding 把 header 顶出来）。
 *
 * @example 标准头部 + body
 * ```vue
 * <hlw-card :padding="false">
 *   <hlw-card-header title="标题" icon="i-fa6-solid-star" extra="副标题" />
 *   <view style="padding: 24rpx 28rpx">content</view>
 * </hlw-card>
 * ```
 *
 * @example 完全自定义头部
 * ```vue
 * <hlw-card>
 *   <template #header>...</template>
 *   <text>内容</text>
 * </hlw-card>
 * ```
 *
 * @example 自定义底部
 * ```vue
 * <hlw-card>
 *   <text>内容</text>
 *   <template #footer-left><text>左侧说明</text></template>
 *   <template #footer-right><button>确认</button></template>
 * </hlw-card>
 * ```
 */
type BorderValue = boolean | string | string[];

interface Props {
    /**
     * 边框，支持三种形式：
     * - `true`（默认）/`false` —— 四边全开 / 全关
     * - 字符串："t r b l" 或 "top right bottom left"，空格分隔，如 `"t b"` = 仅上下
     * - 数组：`['t','l']` 同上
     */
    border?: BorderValue;
    /** 边框颜色，任意 CSS color：`#f00`、`rgb(...)`、`var(--xxx)`；默认走主题 var(--border-color) */
    borderColor?: string;
    /** 边框线型：solid（默认）/ dashed / dotted / double */
    borderStyle?: "solid" | "dashed" | "dotted" | "double";
    /** 边框宽度，CSS 长度值，默认 `1rpx` */
    borderWidth?: string;
    /** 圆角大小，对应 CSS 变量体系 */
    radius?: "none" | "sm" | "md" | "lg" | "xl";
    /** 头部与内容之间是否显示虚线分隔，有 #header slot 时默认 true */
    divider?: boolean;
    /** body 是否有内边距，默认 true */
    padding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    border: true,
    borderColor: "",
    borderStyle: "solid",
    borderWidth: "",
    radius: "xl",
    divider: undefined,
    padding: true,
});

const rootStyle = computed<Record<string, string>>(() => {
    const s: Record<string, string> = {};
    if (props.borderColor) s["--card-border-color"] = props.borderColor;
    if (props.borderStyle && props.borderStyle !== "solid") s["--card-border-style"] = props.borderStyle;
    if (props.borderWidth) s["--card-border-width"] = props.borderWidth;
    return s;
});

const SIDE_MAP: Record<string, string> = {
    t: "top", top: "top",
    r: "right", right: "right",
    b: "bottom", bottom: "bottom",
    l: "left", left: "left",
};

const borderClasses = computed<string[]>(() => {
    if (props.border === false) return [];
    if (props.border === true) return ["hlw-card--bordered"];

    const sides = Array.isArray(props.border)
        ? props.border
        : String(props.border).trim().split(/\s+/).filter(Boolean);

    const seen = new Set<string>();
    const classes: string[] = [];
    for (const s of sides) {
        const side = SIDE_MAP[s.toLowerCase()];
        if (side && !seen.has(side)) {
            seen.add(side);
            classes.push(`hlw-card--border-${side}`);
        }
    }
    return classes.length === 4 ? ["hlw-card--bordered"] : classes;
});

const slots = useSlots();

const hasHeader = computed(() => !!slots.header);

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

    /* 边框 — width / style / color 全部走 CSS 变量，未设置时回落 */
    &--bordered {
        border:
            var(--card-border-width, 1rpx)
            var(--card-border-style, solid)
            var(--card-border-color, var(--border-color, #e2e8f0));
    }

    /* 边框 — 单边 */
    &--border-top {
        border-top:
            var(--card-border-width, 1rpx)
            var(--card-border-style, solid)
            var(--card-border-color, var(--border-color, #e2e8f0));
    }
    &--border-right {
        border-right:
            var(--card-border-width, 1rpx)
            var(--card-border-style, solid)
            var(--card-border-color, var(--border-color, #e2e8f0));
    }
    &--border-bottom {
        border-bottom:
            var(--card-border-width, 1rpx)
            var(--card-border-style, solid)
            var(--card-border-color, var(--border-color, #e2e8f0));
    }
    &--border-left {
        border-left:
            var(--card-border-width, 1rpx)
            var(--card-border-style, solid)
            var(--card-border-color, var(--border-color, #e2e8f0));
    }
}

/* 头部 wrapper（#header slot） */
.hlw-card-header {
    width: 100%;
}

/* 虚线分隔 */
.hlw-card-divider {
    width: 100%;
    border-bottom: 1rpx dashed var(--border-color, #e2e8f0);
}

/* 内容区 */
.hlw-card-body {
    width: 100%;
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
