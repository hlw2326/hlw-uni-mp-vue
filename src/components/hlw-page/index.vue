<template>
    <view class="hlw-page" :style="themePageStyle">
        <view class="hlw-page-header">
            <slot name="header">
                <hlw-header
                    v-if="props.title || props.isBack"
                    :title="props.title"
                    :is-back="props.isBack"
                    :bg-class="props.bgClass"
                />
            </slot>
        </view>

        <hlw-paging
            v-if="props.usePaging"
            ref="pagingRef"
            class="hlw-page-content hlw-page-content--paging"
            :model-value="props.modelValue"
            :fixed="false"
            :use-page-scroll="false"
            :height="'100%'"
            :refresher-enabled="props.refresherEnabled"
            :loading-more-enabled="props.loadingMoreEnabled"
            :default-page-size="props.defaultPageSize"
            :loading-text="props.loadingText"
            :empty-text="props.emptyText"
            :error-text="props.errorText"
            :empty-image="props.emptyImage"
            :use-default-loading="props.useDefaultLoading"
            :use-default-empty="props.useDefaultEmpty"
            @update:model-value="handleUpdateModelValue"
            @query="handleQuery"
        >
            <slot />

            <template v-if="$slots.loading" #loading="slotProps">
                <slot name="loading" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
            </template>
            <template v-if="$slots.empty" #empty="slotProps">
                <slot name="empty" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
            </template>
            <template v-if="$slots['empty-extra']" #empty-extra="slotProps">
                <slot name="empty-extra" :isLoadFailed="slotProps && slotProps.isLoadFailed" />
            </template>
        </hlw-paging>

        <scroll-view
            v-else
            class="hlw-page-content"
            :scroll-y="true"
            :enable-flex="true"
            :enhanced="true"
            :show-scrollbar="false"
            :style="themePageStyle"
        >
            <slot />
        </scroll-view>

        <view class="hlw-page-footer">
            <slot name="footer" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { HlwPagingRef } from "../hlw-paging/types";
import { useThemePageStyle } from "../../composables/theme";

defineOptions({
    name: "HlwPage",
    inheritAttrs: false,
});

interface Props {
    title?: string;
    isBack?: boolean;
    bgClass?: string;
    usePaging?: boolean;
    modelValue?: any[];
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
    title: "",
    isBack: false,
    bgClass: "",
    usePaging: false,
    modelValue: () => [],
    useDefaultLoading: true,
    useDefaultEmpty: true,
});

const emit = defineEmits<{
    "update:modelValue": [value: any[]];
    query: [pageNo: number, pageSize: number, ...args: any[]];
}>();

const pagingRef = ref<HlwPagingRef<any> | null>(null);
const { themePageStyle } = useThemePageStyle();

function handleUpdateModelValue(value: any[]) {
    emit("update:modelValue", value ?? []);
}

function handleQuery(pageNo: number, pageSize: number, ...args: any[]) {
    emit("query", pageNo, pageSize, ...args);
}

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

<style lang="scss" scoped>
.hlw-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg-page, #f6f6f6);
    color: var(--text-primary, #0f172a);
}

.hlw-page-header {
    flex-shrink: 0;
}

.hlw-page-content {
    flex: 1;
    height: 0;
    width: 100%;
}

.hlw-page-content--paging {
    min-height: 0;
}

.hlw-page-footer {
    flex-shrink: 0;
}
</style>
