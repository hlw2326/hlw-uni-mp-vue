export type FontScale = "small" | "normal" | "large" | "xlarge";

export interface FontPreset {
    label: string;
    vars: Record<string, string>;
}

export const FONT_SCALE_KEY = "hlw_font_scale";

export const FONT_PRESETS: Record<FontScale, FontPreset> = {
    small: {
        label: "小字体",
        vars: {
            "--font-xs": "16rpx", "--font-sm": "20rpx", "--font-base": "24rpx",
            "--font-md": "28rpx", "--font-lg": "32rpx", "--font-xl": "36rpx",
        },
    },
    normal: {
        label: "标准",
        vars: {
            "--font-xs": "20rpx", "--font-sm": "24rpx", "--font-base": "28rpx",
            "--font-md": "32rpx", "--font-lg": "36rpx", "--font-xl": "40rpx",
        },
    },
    large: {
        label: "大字体",
        vars: {
            "--font-xs": "24rpx", "--font-sm": "30rpx", "--font-base": "34rpx",
            "--font-md": "40rpx", "--font-lg": "46rpx", "--font-xl": "52rpx",
        },
    },
    xlarge: {
        label: "超大字体",
        vars: {
            "--font-xs": "28rpx", "--font-sm": "36rpx", "--font-base": "42rpx",
            "--font-md": "48rpx", "--font-lg": "56rpx", "--font-xl": "64rpx",
        },
    },
};

export function getCurrentFontScale(): FontScale {
    try {
        const v = uni.getStorageSync(FONT_SCALE_KEY);
        if (v === "small" || v === "large" || v === "xlarge") return v;
    } catch {}
    return "normal";
}

export function getCurrentFontVars(): Record<string, string> {
    return FONT_PRESETS[getCurrentFontScale()].vars;
}
