<template>
    <ad :unit-id="unitId" @load="onLoad" @close="onClose" @error="onError" />
</template>
<script setup lang="ts">
/**
 * HlwAd — 小程序信息流 / Banner 广告组件
 *
 * 对小程序原生 <ad> 组件的封装。
 * 支持微信小程序、抖音小程序等，由 uni-app 编译器适配各平台。
 *
 * Props:
 *   unitId   - 广告单元 ID（各平台在广告后台申请）
 *
 * Emits:
 *   load     - 广告加载成功
 *   close    - 用户关闭广告
 *   error    - 广告加载/展示失败，携带 { errCode, errMsg }
 *
 * @example
 * ```vue
 * <HlwAd unit-id="adunit-xxx" @load="onLoad" @error="onError" />
 * ```
 */

defineOptions({ name: "HlwAd" });

defineProps<{
    /** 广告单元 ID */
    unitId: string;
}>();

const emit = defineEmits<{
    (e: "load", event: any): void;
    (e: "close", event: any): void;
    (e: "error", event: any): void;
}>();

function onLoad(event: any) {
    emit("load", event);
}

function onClose(event: any) {
    emit("close", event);
}

function onError(event: any) {
    console.error("[HlwAd] 广告错误:", event?.detail?.errCode, event?.detail?.errMsg);
    emit("error", event);
}
</script>
