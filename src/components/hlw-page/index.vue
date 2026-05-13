<template>
    <view :class="['hlw-page', attrs.class]" :style="attrs.style">
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

        <scroll-view
            class="hlw-page-content"
            :scroll-y="true"
            :enable-flex="true"
            :enhanced="true"
            :show-scrollbar="false"
            :scroll-top="scrollTo"
            :scroll-with-animation="true"
            @scroll="onScroll"
        >
            <view class="hlw-page-body" :class="bodyClass" :style="bodyStyle">
                <slot />
            </view>
        </scroll-view>

        <view class="hlw-page-footer">
            <slot name="footer" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * hlw-page 不再负责主题 style 注入。
 * 业务项目可通过 @hlw-uni/mp-vite-plugin 的 themePageMeta 自动注入 page-meta。
 * —— 这样才能把 CSS 变量注入到 page 根，scroll-view 等小程序原生组件内部也能继承。
 *
 * provide("hlwPageScroll") —— 给 hlw-back-top 等子组件用：
 *   - scrollTop: Ref<number>     当前滚动位置（来自 scroll-view @scroll）
 *   - scrollToTop(): void        滚动到顶部（带动画）
 */

import { nextTick, provide, ref, useAttrs } from "vue";

defineOptions({
    name: "HlwPage",
    inheritAttrs: false,
});

type ClassValue = string | Record<string, boolean> | Array<string | Record<string, boolean>>;
type StyleValue = string | Record<string, string | number>;

interface Props {
    title?: string;
    isBack?: boolean;
    bgClass?: string;
    /**
     * 透传到 scroll-view 内层 view 包裹（不是 scroll-view 本身）的 class，常用于直接挂 .container。
     * 用 view 包裹是因为 mp-weixin 的 scroll-view 是原生组件，flex/gap 行为跟普通 view 不一致。
     */
    bodyClass?: ClassValue;
    /** 透传到内层 view 包裹的 style，规则同 bodyClass */
    bodyStyle?: StyleValue;
}

const props = withDefaults(defineProps<Props>(), {
    title: "",
    isBack: false,
    bgClass: "",
    bodyClass: "",
    bodyStyle: "",
});
const attrs = useAttrs();

const scrollTop = ref(0);
const scrollTo = ref(0);

function onScroll(e: any) {
    scrollTop.value = e?.detail?.scrollTop ?? 0;
}

function scrollToTop() {
    // 先同步到当前位置，再动画到 0；否则同值不会触发 scroll-view 重滚
    scrollTo.value = scrollTop.value;
    nextTick(() => {
        scrollTo.value = 0;
    });
}

provide("hlwPageScroll", {
    scrollTop,
    scrollToTop,
});
</script>

<style lang="scss" scoped>
.hlw-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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

.hlw-page-body {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.hlw-page-footer {
    flex-shrink: 0;
}
</style>
