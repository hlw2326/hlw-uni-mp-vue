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
import { computed } from "vue";

defineOptions({ name: "HlwAddMini" });

interface Props {
	show?: boolean;
	navigationStyle?: "default" | "custom";
	title?: string;
	desc?: string;
}

const props = withDefaults(defineProps<Props>(), {
	show: false,
	navigationStyle: "default",
	title: "添加到我的小程序",
	desc: "点击右上角 ··· 添加",
});

const emit = defineEmits<{ close: [] }>();

const top = computed(() =>
	props.navigationStyle === "custom" ? `${uni.getSystemInfoSync().statusBarHeight + 48}px` : "12px"
);

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
