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

.hlw-avatar--small  .hlw-avatar__initial { font-size: 22rpx; }
.hlw-avatar--medium .hlw-avatar__initial { font-size: 30rpx; }
.hlw-avatar--large  .hlw-avatar__initial { font-size: 46rpx; }
</style>
