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

        <scroll-view
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
import { useThemePageStyle } from "../../composables/theme";

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

const { themePageStyle } = useThemePageStyle();
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
