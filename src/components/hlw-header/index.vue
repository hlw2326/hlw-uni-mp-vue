<template>
  <view class="hlw-header" :style="{ height: totalNavBarHeight + 'px' }">
    <view class="header-bg-layer" :class="hasBgSlot ? '' : props.bgClass">
      <slot v-if="!props.isBack" name="bg"></slot>
    </view>
    <view class="status-bar-spacer" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="header-content-area" :style="{ height: NAV_BAR_CONTENT_HEIGHT + 'px' }">
      <template v-if="props.isBack">
        <view class="header-back" @click="handleBack">
          <text class="iconfont icon-back"></text>
        </view>
        <view class="header-title">{{ props.title }}</view>
        <view class="header-placeholder"></view>
      </template>
      <slot v-else>
        <view v-if="props.title" class="header-title">{{ props.title }}</view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue';

const getNavBarContentHeight = (): number => {
  try {
    const menuInfo = uni.getMenuButtonBoundingClientRect?.();
    if (!menuInfo) return 44;
    const systemInfo = uni.getSystemInfoSync();
    return (menuInfo.top - systemInfo.statusBarHeight!) * 2 + menuInfo.height;
  } catch {
    return 44;
  }
};

const getStatusBarHeight = (): number => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    return systemInfo.statusBarHeight || 20;
  } catch {
    return 20;
  }
};

const NAV_BAR_CONTENT_HEIGHT = getNavBarContentHeight();

interface Props {
  extraHeight?: number;
  bgClass?: string;
  isBack?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  extraHeight: 0,
  bgClass: '',
  isBack: false,
  title: '',
});

const emit = defineEmits<{
  back: [];
}>();

const handleBack = () => {
  emit('back');
  uni.navigateBack({ delta: 1 });
};

const slots = useSlots();
const hasBgSlot = computed(() => !props.isBack && !!slots.bg);
const statusBarHeight = ref(getStatusBarHeight());
const totalNavBarHeight = computed(() => statusBarHeight.value + NAV_BAR_CONTENT_HEIGHT + props.extraHeight);
</script>

<style lang="scss" scoped>
.hlw-header {
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.status-bar-spacer {
  flex-shrink: 0;
  width: 100%;
  position: relative;
  z-index: 1;
}

.header-content-area {
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-back {
  width: 88rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .iconfont {
    font-size: 40rpx;
  }
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-placeholder {
  width: 88rpx;
  flex-shrink: 0;
}
</style>
