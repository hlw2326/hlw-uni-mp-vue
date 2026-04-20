<template>
    <z-paging
        ref="pagingRef"
        class="hlw-paging"
        :model-value="props.modelValue"
        :fixed="props.fixed"
        :use-page-scroll="props.usePageScroll"
        :height="props.height"
        :refresher-enabled="props.refresherEnabled"
        :loading-more-enabled="props.loadingMoreEnabled"
        :default-page-size="props.defaultPageSize"
        @update:model-value="handleUpdateModelValue"
        @query="handleQuery"
    >
        <slot />

        <template v-if="$slots.loading && !showDefaultLoading" #loading="slotProps">
            <slot name="loading" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
        </template>

        <template v-if="$slots.empty && !showDefaultEmpty" #empty="slotProps">
            <slot name="empty" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
        </template>

        <template v-if="$slots['empty-extra']" #empty-extra="slotProps">
            <slot name="empty-extra" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
        </template>

        <template v-if="showDefaultLoading" #loading>
            <view class="hlw-paging__state hlw-paging__state--loading">
                <hlw-loading :text="props.loadingText" />
            </view>
        </template>

        <template v-if="showDefaultEmpty" #empty="{ isLoadFailed }">
            <view class="hlw-paging__state hlw-paging__state--empty">
                <hlw-empty
                    :image="props.emptyImage"
                    :text="isLoadFailed ? props.errorText : props.emptyText"
                >
                    <slot name="empty-extra" :isLoadFailed="isLoadFailed" />
                </hlw-empty>
            </view>
        </template>
    </z-paging>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import ZPaging from "z-paging/components/z-paging/z-paging.vue";
import type { HlwPagingRef } from "./types";

defineOptions({
    name: "HlwPaging",
    inheritAttrs: false,
});

interface Props {
    modelValue?: any[];
    fixed?: boolean;
    usePageScroll?: boolean;
    height?: string;
    refresherEnabled?: boolean;
    loadingMoreEnabled?: boolean;
    defaultPageSize?: number;
    loadingText?: string;
    emptyText?: string;
    errorText?: string;
    emptyImage?: string;
    useDefaultLoading?: boolean;
    useDefaultEmpty?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    loadingText: "加载中...",
    emptyText: "暂无数据",
    errorText: "加载失败，请稍后重试",
    emptyImage: "",
    useDefaultLoading: true,
    useDefaultEmpty: true,
});

const emit = defineEmits<{
    "update:modelValue": [value: any[]];
    query: [pageNo: number, pageSize: number, ...args: any[]];
}>();

const slots = useSlots();
const pagingRef = ref<HlwPagingRef<any> | null>(null);

function handleUpdateModelValue(value: any[]) {
    emit("update:modelValue", value ?? []);
}

function handleQuery(pageNo: number, pageSize: number, ...args: any[]) {
    emit("query", pageNo, pageSize, ...args);
}

const showDefaultLoading = computed(() => {
    return props.useDefaultLoading && !slots.loading;
});

const showDefaultEmpty = computed(() => {
    return props.useDefaultEmpty && !slots.empty;
});

const getPagingRef = () => pagingRef.value;

const pagingMethodNames = [
    "reload",
    "refresh",
    "refreshToPage",
    "complete",
    "completeByTotal",
    "completeByNoMore",
    "completeByError",
    "completeByKey",
    "clear",
    "addDataFromTop",
    "resetTotalData",
    "endRefresh",
    "updateCustomRefresherHeight",
    "goF2",
    "closeF2",
    "doLoadMore",
    "updatePageScrollTop",
    "updatePageScrollTopHeight",
    "updatePageScrollBottomHeight",
    "updateLeftAndRightWidth",
    "updateFixedLayout",
    "doInsertVirtualListItem",
    "didUpdateVirtualListCell",
    "didDeleteVirtualListCell",
    "updateVirtualListRender",
    "setLocalPaging",
    "doChatRecordLoadMore",
    "addChatRecordData",
    "addKeyboardHeightChangeListener",
    "scrollToTop",
    "scrollToBottom",
    "scrollIntoViewById",
    "scrollIntoViewByNodeTop",
    "scrollToY",
    "scrollToX",
    "scrollIntoViewByIndex",
    "scrollIntoViewByView",
    "setSpecialEffects",
    "setListSpecialEffects",
    "updateCache",
    "getVersion",
] as const;

type PagingMethodName = (typeof pagingMethodNames)[number];

const exposed = pagingMethodNames.reduce((result, methodName) => {
    result[methodName] = (...args: any[]) => {
        return pagingRef.value?.[methodName]?.(...args);
    };

    return result;
}, {
    pagingRef,
    getPagingRef,
} as Record<string, any>);

defineExpose(exposed as {
    pagingRef: typeof pagingRef;
    getPagingRef: () => HlwPagingRef<any> | null;
} & Record<PagingMethodName, (...args: any[]) => any>);
</script>

<style scoped lang="scss">
.hlw-paging {
    width: 100%;
}

.hlw-paging__state {
    width: 100%;
    display: flex;
    justify-content: center;
}

.hlw-paging__state--loading {
    padding: 24rpx 0;
}

.hlw-paging__state--empty {
    min-height: 360rpx;
    padding: 32rpx 0;
}
</style>
