<template>
    <view class="hlw-page">
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
        >
            <slot />
        </scroll-view>

        <view class="hlw-page-footer">
            <slot name="footer" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * hlw-page 不再负责主题 style 注入。
 * 业务页面请在 template 顶部放 `<page-meta :page-style="themePageStyle" />`（配合 useThemePageStyle）
 * —— 这样才能把 CSS 变量注入到 page 根，scroll-view 等小程序原生组件内部也能继承。
 */

defineOptions({
    name: "HlwPage",
    inheritAttrs: false,
});

interface Props {
    title?: string;
    isBack?: boolean;
    bgClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: "",
    isBack: false,
    bgClass: "",
});
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

.hlw-page-footer {
    flex-shrink: 0;
}
</style>
