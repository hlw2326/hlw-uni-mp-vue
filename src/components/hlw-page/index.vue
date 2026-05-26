<template>
    <view :class="theme" style="padding-bottom: 100rpx">
        <hlw-nav-bar :is-back="props.isBack" :title="title" :is-bar="props.isBar"></hlw-nav-bar>
        <slot></slot>
    </view>
</template>

<script lang="ts" setup>
import { useTheme } from "@/core";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
const { theme } = useTheme();

const props = defineProps({
    isBar: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    isBack: {
        type: Boolean,
        default: false,
    },
});

const title = ref(props.title);
</script>

<style></style>
