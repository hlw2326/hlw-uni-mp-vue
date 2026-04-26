export type FontScale = "small" | "compact" | "normal" | "medium" | "large" | "xlarge" | "xxlarge";

export interface FontPreset {
    label: string;
    vars: Record<string, string>;
}

export const FONT_SCALE_KEY = "hlw_font_scale";

export const FONT_PRESETS: Record<FontScale, FontPreset> = {
    small: {
        label: "较小",
        vars: {
            "--font-xs": "16rpx", "--font-sm": "20rpx", "--font-base": "24rpx",
            "--font-md": "28rpx", "--font-lg": "32rpx", "--font-xl": "36rpx",
        },
    },
    compact: {
        label: "略小",
        vars: {
            "--font-xs": "18rpx", "--font-sm": "22rpx", "--font-base": "26rpx",
            "--font-md": "30rpx", "--font-lg": "34rpx", "--font-xl": "38rpx",
        },
    },
    normal: {
        label: "标准",
        vars: {
            "--font-xs": "20rpx", "--font-sm": "24rpx", "--font-base": "28rpx",
            "--font-md": "32rpx", "--font-lg": "36rpx", "--font-xl": "40rpx",
        },
    },
    medium: {
        label: "适中",
        vars: {
            "--font-xs": "22rpx", "--font-sm": "28rpx", "--font-base": "32rpx",
            "--font-md": "36rpx", "--font-lg": "42rpx", "--font-xl": "46rpx",
        },
    },
    large: {
        label: "较大",
        vars: {
            "--font-xs": "24rpx", "--font-sm": "30rpx", "--font-base": "34rpx",
            "--font-md": "40rpx", "--font-lg": "46rpx", "--font-xl": "52rpx",
        },
    },
    xlarge: {
        label: "超大",
        vars: {
            "--font-xs": "28rpx", "--font-sm": "36rpx", "--font-base": "42rpx",
            "--font-md": "48rpx", "--font-lg": "56rpx", "--font-xl": "64rpx",
        },
    },
    xxlarge: {
        label: "特大",
        vars: {
            "--font-xs": "32rpx", "--font-sm": "42rpx", "--font-base": "48rpx",
            "--font-md": "56rpx", "--font-lg": "64rpx", "--font-xl": "72rpx",
        },
    },
};

export function getCurrentFontScale(): FontScale {
    try {
        const v = uni.getStorageSync(FONT_SCALE_KEY);
        if (v === "small" || v === "compact" || v === "medium" || v === "large" || v === "xlarge" || v === "xxlarge") return v;
    } catch {}
    return "normal";
}

export function getCurrentFontVars(): Record<string, string> {
    return FONT_PRESETS[getCurrentFontScale()].vars;
}
