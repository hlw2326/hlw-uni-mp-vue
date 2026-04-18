<template>
    <navigator v-if="url" :url="url" class="hlw-cell" :class="{ 'hlw-cell--border': border }" hover-class="hlw-cell--hover">
        <view v-if="icon || $slots.icon" class="hlw-cell-icon">
            <slot name="icon"><view :class="icon" /></slot>
        </view>
        <view class="hlw-cell-body">
            <view class="hlw-cell-title">
                <slot name="title">{{ title }}</slot>
                <view v-if="label" class="hlw-cell-label">{{ label }}</view>
            </view>
            <view class="hlw-cell-value">
                <slot name="value">{{ value }}</slot>
            </view>
        </view>
        <view class="hlw-cell-arrow" />
    </navigator>
    <view v-else class="hlw-cell" :class="{ 'hlw-cell--border': border, 'hlw-cell--link': isLink }" :hover-class="isLink ? 'hlw-cell--hover' : ''" @tap="$emit('click')">
        <view v-if="icon || $slots.icon" class="hlw-cell-icon">
            <slot name="icon"><view :class="icon" /></slot>
        </view>
        <view class="hlw-cell-body">
            <view class="hlw-cell-title">
                <slot name="title">{{ title }}</slot>
                <view v-if="label" class="hlw-cell-label">{{ label }}</view>
            </view>
            <view class="hlw-cell-value">
                <slot name="value">{{ value }}</slot>
            </view>
        </view>
        <view v-if="isLink" class="hlw-cell-arrow" />
        <slot name="right" />
    </view>
</template>

<script setup lang="ts">
/**
 * HlwCell — 列表单元格
 *
 * 通用列表项：左侧 icon + 标题/描述 + 右侧内容/箭头。
 * 传入 url 自动渲染为 navigator 组件。
 *
 * @props
 *   title  - 标题文字
 *   label  - 描述文字（标题下方灰色小字）
 *   value  - 右侧内容文字
 *   icon   - 左侧图标 class（如 i-fa6-solid-gear）
 *   isLink - 是否显示右箭头，默认 false
 *   url    - 跳转地址（有值则渲染为 navigator）
 *   border - 是否显示底部分割线，默认 true
 *
 * @events
 *   click - 点击事件（url 模式下由 navigator 处理跳转）
 *
 * @slots
 *   icon  - 自定义左侧图标
 *   title - 自定义标题区域
 *   value - 自定义右侧内容
 *   right - 自定义最右侧区域
 *
 * @example
 * ```vue
 * <HlwCell title="设置" icon="i-fa6-solid-gear" is-link url="/pages/settings/index" />
 * <HlwCell title="版本号" value="1.0.0" />
 * ```
 */
interface Props {
    title?: string;
    label?: string;
    value?: string;
    icon?: string;
    isLink?: boolean;
    url?: string;
    border?: boolean;
}

withDefaults(defineProps<Props>(), {
    title: "",
    label: "",
    value: "",
    icon: "",
    isLink: false,
    url: "",
    border: true,
});

defineEmits<{ click: [] }>();
</script>

<style lang="scss" scoped>
.hlw-cell {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    background: #fff;
    gap: 20rpx;

    &--border {
        border-bottom: 1rpx solid var(--border-color-light, #f1f5f9);
        &:last-child { border-bottom: none; }
    }
    &--hover { background: #f8fafc; }
}

.hlw-cell-icon {
    font-size: var(--font-lg, 36rpx);
    color: var(--primary-color, #3b82f6);
    flex-shrink: 0;
}

.hlw-cell-body {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.hlw-cell-title {
    font-size: var(--font-base, 28rpx);
    color: #1e293b;
}

.hlw-cell-label {
    font-size: var(--font-xs, 20rpx);
    color: #94a3b8;
    margin-top: 4rpx;
}

.hlw-cell-value {
    font-size: var(--font-sm, 24rpx);
    color: #94a3b8;
    flex-shrink: 0;
}

.hlw-cell-arrow {
    width: 16rpx;
    height: 16rpx;
    border-top: 3rpx solid #c0c4cc;
    border-right: 3rpx solid #c0c4cc;
    transform: rotate(45deg);
    flex-shrink: 0;
}
</style>
