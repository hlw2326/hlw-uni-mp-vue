<template>
    <view class="navbar" :class="theme">
        <view :style="bar_style"></view>
        <view class="header" :style="{ height: header_height + 'px' }">
            <view @tap="tapBack" class="left" v-if="props.isBack">
                <text class="i-fa6-solid-chevron-left icon-left"></text>
            </view>
            <text class="title">{{ title }}</text>
        </view>
        <view class="status-bar" v-if="theme === 'color-theme'">
            <view class="within"></view>
        </view>
    </view>
    <view :style="{ height: navbar_height + 'px' }"></view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTheme } from "@/core";

const { theme } = useTheme();

const statusBarHeight: number = uni.getSystemInfoSync()?.statusBarHeight || 0;
const menuButtonInfo = uni.getMenuButtonBoundingClientRect();

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

const bar_style = computed(() => {
    const style = {
        height: statusBarHeight + "px",
    };
    return style;
});
let status_bar_height = 0;
if (props.isBar) {
    status_bar_height = 15;
}

const header_height = ref<number>(menuButtonInfo.bottom - statusBarHeight + 6);
const navbar_height = ref(header_height.value + statusBarHeight);
const status_bar_height_style = `${status_bar_height}px`;

function tapBack() {
    uni.navigateBack({
        fail: (err) => {
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
    });
}
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 750rpx;
    z-index: 999;
    border-bottom: 1rpx solid rgba(226, 232, 240, 0);
    transition:
        background-color 0.2s ease,
        border-bottom 0.2s ease;

    /* 白色主题：白色导航栏，下方加一条灰色的细边框 */
    &.white-theme {
        background-color: var(--navbar-bg-color, #ffffff);
        border-bottom: var(--navbar-border-bottom, 1rpx solid #e7e7e7);

        .title {
            color: var(--font-color, #303048);
        }

        .icon-left {
            color: var(--font-color, #303048);
        }
    }

    /* 简洁主题（原无色）：没有任何颜色（透明背景，无边框） */
    &.light-theme {
        background-color: rgba(255, 255, 255, 0);
        border-bottom: 1rpx solid rgba(226, 232, 240, 0);

        .title {
            color: var(--font-color, #303048);
        }

        .icon-left {
            color: var(--font-color, #303048);
        }
    }

    /* 单色主题：背景色与页面全局背景色一致，无明显界限，无边框 */
    &.mono-theme {
        background-color: var(--bg-color, var(--bg-page, #f8f8f8));
        border-bottom: 1rpx solid rgba(226, 232, 240, 0);

        .title {
            color: var(--font-color, #303048);
        }

        .icon-left {
            color: var(--font-color, #303048);
        }
    }

    /* 颜色主题：导航栏使用主题色，下方带有白色圆角过渡 */
    &.color-theme {
        background-color: var(--primary-color, #3b82f6);
        border-bottom: 1rpx solid rgba(226, 232, 240, 0);

        .title {
            color: #ffffff;
        }

        .icon-left {
            color: #ffffff;
        }
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;

        .left {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 0rpx;
            width: 100rpx;
            height: 100%;

            .icon-left {
                font-size: 30rpx;
            }
        }

        .title {
            font-size: var(--navbar-font-size, 26rpx);
            letter-spacing: 1rpx;
            font-weight: normal;
        }
    }

    .status-bar {
        background-color: transparent;
        height: v-bind(status_bar_height_style);
        width: 750rpx;
        position: relative;

        .within {
            position: absolute;
            left: 0;
            top: 0;
            width: 750rpx;
            height: calc(v-bind(status_bar_height_style) + 2rpx);
            background-color: var(--bg-color, var(--bg-page, #f8f8f8));
            border-top-left-radius: var(--status-bar-border, var(--card-radius, 32rpx));
            border-top-right-radius: var(--status-bar-border, var(--card-radius, 32rpx));
        }
    }
}
</style>
