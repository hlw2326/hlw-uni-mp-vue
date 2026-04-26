<!--
    HlwAd — 小程序展示型广告原子组件
    ------------------------------------------------------------------
    用法（业务方从 mp-core useAd().config 取对应 unit_id 传入）：
        hlw-ad type="banner" :unit-id="config.banner_unit_id"
        hlw-ad type="grid"   :unit-id="config.grid_unit_id"
        hlw-ad type="custom" :unit-id="config.custom_unit_id"

    渲染分支：
      - banner        → ad type="banner" unit-id="..."（微信流量主自带样式）
      - grid / custom → ad-custom unit-id="..."（原生模板广告）

    video / reward / popup 不走这个组件：
      - reward / popup → useAd().showReward() / showPopup()
      - video（贴片）须嵌在 video 标签内，业务侧自己用 <ad type="video">
-->
<template>
    <view
        v-if="visible"
        :class="['hlw-ad', `hlw-ad--${type}`, customClass]"
        :style="customStyle"
    >
        <ad
            v-if="type === 'banner'"
            type="banner"
            :unit-id="unitId"
            @load="onLoad"
            @error="onError"
        />
        <ad-custom
            v-else
            :unit-id="unitId"
            @load="onLoad"
            @error="onError"
        />
    </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "HlwAd" });

interface Props {
    /** 广告类型 — 仅展示型（banner / grid / custom） */
    type: "banner" | "grid" | "custom";
    /** 微信广告单元 id；空字符串 → 不渲染 */
    unitId: string;
    /** 自定义样式（合并到根元素） */
    customStyle?: string;
    /** 自定义 class */
    customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    customStyle: "",
    customClass: "",
});

const emit = defineEmits<{
    (e: "load", event: any): void;
    (e: "error", event: any): void;
}>();

/** 有 unit_id 才渲染 */
const visible = computed(() => !!props.unitId);

function onLoad(event: any) {
    emit("load", event);
}
function onError(event: any) {
    console.warn(`[HlwAd] type=${props.type} error`, event?.detail);
    emit("error", event);
}
</script>

<style scoped>
.hlw-ad {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--surface-card, #ffffff);
}

/* 格子广告：默认右下悬浮；微信硬性规则要求 wrapper 透明无圆角，customStyle 可覆盖 */
.hlw-ad--grid {
    position: fixed;
    right: 20rpx;
    bottom: 200rpx;
    z-index: 99;
    border-radius: 0;
    overflow: visible;
    background: transparent;
}
</style>
