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
            <slot></slot>
        </scroll-view>
        <view class="hlw-page-footer">
            <slot name="footer"></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
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
