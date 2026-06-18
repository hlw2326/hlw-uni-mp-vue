<template>
    <view class="hlw-search" :style="background ? { background } : {}">
        <view class="hlw-search-box" :class="{ 'hlw-search-box--round': shape === 'round' }">
            <view class="hlw-search-icon i-fa6-solid-magnifying-glass" />
            <input
                class="hlw-search-input"
                type="text"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                confirm-type="search"
                @input="onInput"
                @confirm="$emit('search', modelValue)"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
            />
            <view v-if="clearable && modelValue" class="hlw-search-clear i-fa6-solid-xmark" @tap="onClear" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * HlwSearch — 高感官度输入搜索栏组件
 *
 * 规范化的小程序搜索栏输入框，支持一键清空、禁用、聚焦/失焦回调及回车直接搜索。
 *
 * @props
 *   modelValue  - 双向绑定的输入内容
 *   placeholder - 占位符提示文本，默认 "搜索"
 *   disabled    - 是否禁用输入，默认 false
 *   clearable   - 是否允许一键清空输入，默认 true
 *   shape       - 形状样式：square(方角) / round(圆角)，默认 round
 *   background  - 自定义搜索栏组件的背景色
 *
 * @events
 *   update:modelValue - 更新绑定内容时触发
 *   search            - 点击键盘回车搜索时触发 (value)
 *   clear             - 点击清除按钮时触发
 *   focus             - 输入框聚焦时触发
 *   blur              - 输入框失焦时触发
 *
 * @example
 * ```vue
 * <HlwSearch v-model="keywords" placeholder="搜索商品" @search="onSearch" />
 * ```
 */
interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    shape?: "square" | "round";
    background?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    placeholder: "搜索",
    disabled: false,
    clearable: true,
    shape: "round",
    background: "",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
    search: [value: string];
    clear: [];
    focus: [];
    blur: [];
}>();

function onInput(e: any) {
    emit("update:modelValue", e?.detail?.value ?? "");
}

function onClear() {
    emit("update:modelValue", "");
    emit("clear");
}
</script>

<style lang="scss" scoped>
.hlw-search {
    padding: 16rpx 24rpx;
}

.hlw-search-box {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 12rpx 24rpx;
    background: #f1f5f9;
    border-radius: var(--radius-md, 16rpx);

    &--round { border-radius: 999rpx; }
}

.hlw-search-icon {
    font-size: var(--font-sm, 26rpx);
    flex-shrink: 0;
    opacity: 0.5;
}

.hlw-search-input {
    flex: 1;
    font-size: var(--font-sm, 26rpx);
    color: #1e293b;
    min-height: 40rpx;
}

.hlw-search-clear {
    font-size: var(--font-base, 30rpx);
    color: #94a3b8;
    line-height: 1;
    flex-shrink: 0;
    padding: 4rpx;
}
</style>
