<template>
    <view :class="`hlw-avatar hlw-avatar--${size ?? 'medium'}`">
        <image
            v-if="src && !loadError"
            class="hlw-avatar__image"
            :src="src"
            mode="aspectFill"
            @error="loadError = true"
        />
        <view v-else class="hlw-avatar__placeholder">
            <text class="hlw-avatar__initial">{{ initial }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * HlwAvatar — 头像组件
 *
 * 显示用户头像，图片加载失败时自动回退到姓名首字母占位。
 *
 * @props
 *   src   - 头像图片地址
 *   name  - 用户名称，用于提取首字母（图片缺失时显示）
 *   size  - 尺寸：small(56rpx) / medium(80rpx) / large(120rpx)，默认 medium
 *
 * @example
 * ```vue
 * <HlwAvatar src="/avatar.png" name="张三" size="large" />
 * ```
 */
import { ref, computed } from 'vue';

const props = defineProps<{
    src?: string;
    name?: string;
    size?: 'small' | 'medium' | 'large';
}>();

const loadError = ref(false);
const initial = computed(() => {
    if (!props.name) return '?';
    return props.name.charAt(0).toUpperCase();
});
</script>

<style scoped>
.hlw-avatar {
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.hlw-avatar--small  { width: 56rpx;  height: 56rpx; }
.hlw-avatar--medium { width: 80rpx;  height: 80rpx; }
.hlw-avatar--large  { width: 120rpx; height: 120rpx; }

.hlw-avatar__image {
    width: 100%;
    height: 100%;
}

.hlw-avatar__placeholder {
    width: 100%;
    height: 100%;
    background: #07c160;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hlw-avatar__initial {
    color: #fff;
    font-weight: bold;
}

.hlw-avatar--small  .hlw-avatar__initial { font-size: var(--font-xs, 20rpx); }
.hlw-avatar--medium .hlw-avatar__initial { font-size: var(--font-base, 28rpx); }
.hlw-avatar--large  .hlw-avatar__initial { font-size: var(--font-xl, 40rpx); }
</style>
