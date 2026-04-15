<template>
  <view class="hlw-card">
    <view
      v-if="$slots.header || title || icon || $slots['header-left'] || $slots['header-right']"
      class="hlw-card-header"
    >
      <slot name="header">
        <view class="flex items-center justify-between px-5 py-4 border-0 border-b border-dashed border-slate-200 bg-slate-50/30">
          <view v-if="$slots['header-left'] || title || icon">
            <slot name="header-left">
              <view class="text-sm font-bold text-slate-800 flex items-center gap-2 tracking-wide">
                <text v-if="icon" :class="[icon, iconColor]"></text>
                <text>{{ title }}</text>
              </view>
            </slot>
          </view>
          <view v-if="$slots['header-right'] || extra">
            <slot name="header-right">
              <text
                v-if="extra"
                class="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 tracking-wide"
              >{{ extra }}</text>
            </slot>
          </view>
        </view>
      </slot>
    </view>
    <view class="hlw-card-body">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  icon?: string;
  iconColor?: string;
  extra?: string;
}

withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  iconColor: '',
  extra: '',
});

defineOptions({
  options: {
    styleIsolation: 'shared',
    virtualHost: true,
  },
});
</script>

<style scoped>
.hlw-card {
  @apply bg-white rounded-xl border border-solid border-slate-200 overflow-hidden w-full;
}
</style>
