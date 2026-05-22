<template>
	<view v-if="props.show" class="hlw-add-mini" :style="{ top }">
		<view class="hlw-add-mini__arrow" />
		<view class="hlw-add-mini__content">
			<view class="hlw-add-mini__text">
				<view class="hlw-add-mini__title">{{ props.title }}</view>
				<view v-if="props.desc" class="hlw-add-mini__desc">{{ props.desc }}</view>
			</view>
			<view class="hlw-add-mini__close" @tap="close">×</view>
		</view>
	</view>
</template>

<script setup lang="ts">
/**
 * HlwAddMini - 添加小程序提示气泡组件
 * 
 * 用于提示用户点击右上角将当前小程序“添加到我的小程序”中，以提升用户留存。
 * 会根据是否为自定义导航栏（custom），自动调整气泡浮动位置（避开胶囊按钮与状态栏）。
 */
import { computed } from "vue";
import { useDevice } from "../../composables/device";

defineOptions({ name: "HlwAddMini" });

interface Props {
	/** 是否显示提示气泡 */
	show?: boolean;
	/** 页面导航栏样式：default (系统默认) | custom (自定义导航) */
	navigationStyle?: "default" | "custom";
	/** 气泡主标题文字 */
	title?: string;
	/** 气泡副标题/描述文字 */
	desc?: string;
}

const props = withDefaults(defineProps<Props>(), {
	show: false,
	navigationStyle: "default",
	title: "添加到我的小程序",
	desc: "点击右上角 ··· 添加",
});

const emit = defineEmits<{
	/** 点击关闭按钮时触发 */
	close: []
}>();

// 从 useDevice 获取缓存的设备系统信息，规避在 computed 中频繁调用同步系统 API 的性能问题
const { info } = useDevice();

const top = computed(() =>
	props.navigationStyle === "custom" ? `${info.status_bar_height + 48}px` : "12px"
);

/**
 * 触发关闭气泡事件。
 */
function close() {
	emit("close");
}
</script>

<style lang="scss" scoped>
.hlw-add-mini {
	position: fixed;
	right: 22rpx;
	z-index: 32;
	width: 340rpx;
	animation: hlw-add-mini-in 0.22s ease-out both;
}

.hlw-add-mini__arrow {
	position: absolute;
	right: 56rpx;
	top: -10rpx;
	width: 20rpx;
	height: 20rpx;
	background: rgba(17, 24, 39, 0.82);
	transform: rotate(45deg);
}

.hlw-add-mini__content {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 16rpx 14rpx 16rpx 20rpx;
	border-radius: 14rpx;
	background: rgba(17, 24, 39, 0.82);
	box-shadow: 0 12rpx 34rpx rgba(15, 23, 42, 0.22);
}

.hlw-add-mini__text {
	flex: 1;
	min-width: 0;
}

.hlw-add-mini__title {
	color: #ffffff;
	font-size: 25rpx;
	font-weight: 400;
	line-height: 1.3;
    letter-spacing: 1rpx;
}

.hlw-add-mini__desc {
	margin-top: 4rpx;
	color: rgba(255, 255, 255, 0.72);
	font-size: 21rpx;
	line-height: 1.3;
    letter-spacing: 1rpx;
}

.hlw-add-mini__close {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 36rpx;
	height: 36rpx;
	color: rgba(255, 255, 255, 0.72);
	font-size: 30rpx;
	line-height: 1;
}

@keyframes hlw-add-mini-in {
	0% {
		opacity: 0;
		transform: translateY(-8rpx);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
