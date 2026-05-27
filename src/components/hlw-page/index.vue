<template>
    <view :class="[theme, fontSizeClass, fontFamilyClass]">
        <hlw-nav-bar v-if="props.isBar" :is-back="props.isBack" :title="title" :is-bar="props.isBar"></hlw-nav-bar>
        <slot></slot>
    </view>
</template>

<script lang="ts" setup>
import { useTheme } from "@/core";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
const { theme, fontSizeClass, fontFamilyClass } = useTheme();

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

<style lang="scss">
/* 全局系统字体大小缩放配置 */
.font-size-small {
    --font-xs: 18rpx;
    --font-sm: 22rpx;
    --font-base: 24rpx;
    --font-md: 28rpx;
    --font-lg: 32rpx;
    --font-xl: 36rpx;
}

.font-size-standard {
    --font-xs: 20rpx;
    --font-sm: 24rpx;
    --font-base: 28rpx;
    --font-md: 32rpx;
    --font-lg: 36rpx;
    --font-xl: 40rpx;
}

.font-size-large {
    --font-xs: 22rpx;
    --font-sm: 28rpx;
    --font-base: 32rpx;
    --font-md: 36rpx;
    --font-lg: 40rpx;
    --font-xl: 44rpx;
}

.font-size-extra-large {
    --font-xs: 24rpx;
    --font-sm: 32rpx;
    --font-base: 36rpx;
    --font-md: 40rpx;
    --font-lg: 44rpx;
    --font-xl: 48rpx;
}

/* 全局字体样式配置 */
.font-family-system {
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif !important;
    view,
    text,
    button,
    input,
    textarea {
        font-family: inherit !important;
    }
}

.font-family-sans {
    font-family: "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif !important;
    view,
    text,
    button,
    input,
    textarea {
        font-family: inherit !important;
    }
}

.font-family-serif {
    font-family: "Songti SC", "STSong", "SimSun", "Georgia", serif !important;
    view,
    text,
    button,
    input,
    textarea {
        font-family: inherit !important;
    }
}

.font-family-kaiti {
    font-family: "Kaiti SC", "STKaiti", "KaiTi", "SimKai", serif !important;
    view,
    text,
    button,
    input,
    textarea {
        font-family: inherit !important;
    }
}
</style>
