<template>
    <view class="contact-card">
        <view class="contact-copy">
            <text class="contact-title">{{ title }}</text>
            <text class="contact-desc">{{ desc }}</text>
        </view>
        <button
            class="contact-button"
            open-type="contact"
            :send-message-title="resolvedContact.title"
            :send-message-path="resolvedContact.path"
            :send-message-img="resolvedContact.img"
            :show-message-card="resolvedContact.show"
        >
            <text class="i-ri-customer-service-line contact-button-icon" />
            <text class="contact-button-text">{{ resolvedBtnTitle }}</text>
        </button>
    </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ContactConfig {
    send_message_title?: string;
    send_message_path?: string;
    send_message_img?: string;
    show_message_card?: boolean;
}

const props = withDefaults(
    defineProps<{
        title: string;
        desc: string;
        btn_title?: string;
        contact?: ContactConfig;
    }>(),
    {
        btn_title: "",
        contact: () => ({}),
    }
);

const resolvedBtnTitle = computed(() => {
    return props.btn_title || "联系客服";
});

const resolvedContact = computed(() => {
    const c = props.contact || {};
    return {
        title: c.send_message_title ?? "",
        path: c.send_message_path ?? "",
        img: c.send_message_img ?? "",
        show: c.show_message_card ?? false,
    };
});
</script>

<style scoped lang="scss">
.contact-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--card-padding);
    border: 1rpx solid var(--border-color-light);
    border-radius: var(--card-radius);
    background: linear-gradient(135deg, #ffffff 0%, var(--primary-light, rgba(76, 68, 239, 0.05)) 100%);
}

.contact-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    margin-right: 22rpx;
}

.contact-title {
    margin-bottom: 8rpx;
    color: #1f2937;
    font-size: var(--font-base);
    line-height: 1.3;
    letter-spacing: 3rpx;
}

.contact-desc {
    color: #94a3b8;
    font-size: var(--font-sm);
    line-height: 1.45;
    letter-spacing: 3rpx;
}

.contact-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    width: 176rpx;
    height: 68rpx;
    flex-shrink: 0;
    margin: 0;
    border-radius: var(--radius-full);
    background: var(--primary-color, #3b82f6);
    color: #ffffff;
    font: inherit;
    line-height: 68rpx;
}

.contact-button-icon {
    width: var(--font-sm);
    height: var(--font-sm);
}

.contact-button-text {
    color: inherit;
    font-size: var(--font-sm);
    line-height: 1;
}
</style>
