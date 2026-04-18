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
    font-size: var(--font-sm, 24rpx);
    flex-shrink: 0;
    opacity: 0.5;
}

.hlw-search-input {
    flex: 1;
    font-size: var(--font-sm, 24rpx);
    color: #1e293b;
    min-height: 40rpx;
}

.hlw-search-clear {
    font-size: 28rpx;
    color: #94a3b8;
    line-height: 1;
    flex-shrink: 0;
    padding: 4rpx;
}
</style>
