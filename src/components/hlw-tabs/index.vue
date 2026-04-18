<template>
    <scroll-view class="hlw-tabs" :scroll-x="scrollable" :enhanced="true" :show-scrollbar="false">
        <view class="hlw-tabs-wrap">
            <view
                v-for="(item, index) in items"
                :key="index"
                class="hlw-tab"
                :class="{ 'hlw-tab--active': modelValue === index }"
                @tap="onChange(index)"
            >
                <text class="hlw-tab-text">{{ typeof item === "string" ? item : item.label }}</text>
                <view
                    v-if="typeof item !== 'string' && item.badge"
                    class="hlw-tab-badge"
                >{{ item.badge }}</view>
                <view v-if="modelValue === index" class="hlw-tab-line" :style="{ width: lineWidth }" />
            </view>
        </view>
    </scroll-view>
</template>

<script setup lang="ts">
/**
 * HlwTabs — 选项卡
 *
 * 横向选项卡切换，支持文字 / 对象配置、徽标和滚动模式。
 * 激活项跟随 --primary-color 主题色。
 *
 * @props
 *   modelValue - 当前选中索引，支持 v-model，默认 0
 *   items      - 选项列表：string[] 或 { label, badge? }[]
 *   scrollable - 超出时是否可横向滚动，默认 false
 *   lineWidth  - 底部指示线宽度，默认 40rpx
 *
 * @events
 *   update:modelValue - 切换时触发
 *   change            - 切换时触发（携带新索引）
 *
 * @example
 * ```vue
 * <HlwTabs v-model="activeTab" :items="['推荐', '热门', '最新']" />
 * <HlwTabs v-model="tab" :items="[{ label: '消息', badge: '3' }, { label: '关注' }]" />
 * ```
 */
export interface HlwTabItem {
    label: string;
    badge?: string;
}

interface Props {
    modelValue?: number;
    items?: (string | HlwTabItem)[];
    scrollable?: boolean;
    lineWidth?: string;
}

withDefaults(defineProps<Props>(), {
    modelValue: 0,
    items: () => [],
    scrollable: false,
    lineWidth: "40rpx",
});

const emit = defineEmits<{ "update:modelValue": [index: number]; change: [index: number] }>();

function onChange(index: number) {
    emit("update:modelValue", index);
    emit("change", index);
}
</script>

<style lang="scss" scoped>
.hlw-tabs {
    background: #fff;
    white-space: nowrap;
}

.hlw-tabs-wrap {
    display: inline-flex;
    min-width: 100%;
}

.hlw-tab {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx 28rpx;
    gap: 6rpx;
    transition: color 0.2s;

    &--active .hlw-tab-text {
        color: var(--primary-color, #3b82f6);
        font-weight: 600;
    }
}

.hlw-tab-text {
    font-size: var(--font-base, 28rpx);
    color: #64748b;
}

.hlw-tab-badge {
    padding: 0 8rpx;
    min-width: 28rpx;
    height: 28rpx;
    line-height: 28rpx;
    font-size: 18rpx;
    text-align: center;
    color: #fff;
    background: #ef4444;
    border-radius: 999rpx;
}

.hlw-tab-line {
    position: absolute;
    bottom: 4rpx;
    left: 50%;
    transform: translateX(-50%);
    height: 6rpx;
    border-radius: 6rpx;
    background: var(--primary-color, #3b82f6);
    transition: width 0.2s;
}
</style>
