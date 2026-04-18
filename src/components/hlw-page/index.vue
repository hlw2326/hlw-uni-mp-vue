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
            <slot></slot>
        </scroll-view>
        <view class="hlw-page-footer">
            <slot name="footer"></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useThemePageStyle } from "../../composables/theme";
/**
 * HlwPage — 页面布局容器
 *
 * 全屏 flex 布局：固定 header + 可滚动 content + 固定 footer。
 * 传入 title/isBack 自动渲染 HlwHeader，也可通过 header 插槽完全自定义。
 *
 * @props
 *   title   - 页面标题（自动渲染 HlwHeader）
 *   isBack  - 是否显示返回按钮，默认 false
 *   bgClass - header 背景 CSS class
 *
 * @slots
 *   header  - 自定义顶部（覆盖默认 HlwHeader）
 *   default - 主体可滚动内容
 *   footer  - 固定底部
 *
 * @example
 * ```vue
 * <HlwPage title="首页" bg-class="header-bg">
 *   <view>页面内容</view>
 *   <template #footer><view>底部栏</view></template>
 * </HlwPage>
 * ```
 */
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
