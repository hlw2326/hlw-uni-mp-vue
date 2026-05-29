<template>
    <view class="navbar" :class="theme">
        <view :style="bar_style"></view>
        <view class="header" :style="{ height: header_height + 'px' }">
            <view @tap="tapBack" class="left" v-if="props.isBack">
                <span class="i-fa6-solid-chevron-left icon-left"></span>
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
/**
 * HlwNavBar — 自定义导航栏组件
 *
 * 自适应状态栏高度与胶囊按钮，完美替代微信小程序原生导航栏。支持不同主题配色、返回按钮及自适应高度。
 *
 * @props
 *   title   - 导航栏标题文字
 *   isBack  - 是否显示返回按钮，默认 false；点击自动回退或回到首页
 *   isBar   - 是否占用状态栏高度，默认 false
 *
 * @example
 * ```vue
 * <hlw-nav-bar title="设置中心" is-back />
 * ```
 */
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
            color: var(--text-primary, #303048);
        }

        .icon-left {
            color: var(--text-primary, #303048);
        }
    }

    /* 简洁主题：背景色与页面全局背景色一致，无明显界限，无边框 */
    &.light-theme {
        background-color: var(--bg-page, #f8f8f8);
        border-bottom: 1rpx solid rgba(226, 232, 240, 0);

        .title {
            color: var(--text-primary, #303048);
        }

        .icon-left {
            color: var(--text-primary, #303048);
        }
    }

    /* 单色主题：纯主题色导航栏，无边框，无圆角 */
    &.mono-theme {
        background-color: var(--primary-color, #3b82f6);
        border-bottom: 1rpx solid rgba(226, 232, 240, 0);

        .title {
            color: #ffffff;
        }

        .icon-left {
            color: #ffffff;
        }
    }

    /* 颜色主题：导航栏使用立体光影感的主题色渐变背景（反向：左上偏深，右下偏亮），下方带有白色圆角过渡 */
    &.color-theme {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%), var(--primary-color, #3b82f6);
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
            font-size: var(--font-md, var(--navbar-font-size, 32rpx));
            letter-spacing: 2rpx;
            font-weight: 500;
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
