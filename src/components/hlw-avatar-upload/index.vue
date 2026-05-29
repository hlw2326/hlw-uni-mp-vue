<template>
    <view class="hlw-avatar-upload">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" @click="onClick">
            <hlw-avatar :src="props.src || ''" :name="props.name || '微信用户'" :size="props.size" :border="props.border" />
            <view class="edit-avatar">
                <span class="i-fa6-solid-camera edit-avatar-icon" />
            </view>
        </button>
    </view>
</template>

<script setup lang="ts">
defineOptions({ name: "HlwAvatarUpload" });

interface Props {
    /** 当前头像的网络/本地路径 */
    src?: string;
    /** 无头像时的备用展示昵称 */
    name?: string;
    /** 头像尺寸，可选 'small' | 'medium' | 'large' */
    size?: "small" | "medium" | "large";
    /** 边框线宽 */
    border?: number;
}

const props = withDefaults(defineProps<Props>(), {
    src: "",
    name: "微信用户",
    size: "large",
    border: 3,
});

const emit = defineEmits<{
    (e: "onAvatar", filePath: string): void;
}>();

function onChooseAvatar(event: any) {
    const filePath = String(event?.detail?.avatarUrl || "");
    if (filePath) {
        emit("onAvatar", filePath);
    }
}

function onClick() {
    // #ifndef MP-WEIXIN
    uni.chooseImage({
        count: 1,
        success: (res) => {
            const filePath = res.tempFilePaths[0];
            if (filePath) {
                emit("onAvatar", filePath);
            }
        },
    });
    // #endif
}
</script>

<style scoped>
.hlw-avatar-upload {
    display: inline-block;
}

.avatar-wrapper {
    position: relative;
    display: inline-block;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    background: transparent;
    line-height: normal;
    border: none;
    overflow: visible;
    cursor: pointer;
}

.avatar-wrapper::after {
    border: none;
    display: none;
}

.edit-avatar {
    position: absolute;
    bottom: -8rpx;
    right: -8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44rpx;
    height: 44rpx;
    margin: 0;
    padding: 0;
    border: 1rpx solid #e2e8f0; /* 圆角灰线 */
    border-radius: 999rpx;
    background: #ffffff; /* 白色背景 */
    color: #64748b; /* 灰色相机图标 */
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.edit-avatar .edit-avatar-icon {
    font-size: 18rpx;
}
</style>
