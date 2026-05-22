/**
 * 字体大小缩放档位类型。
 * 从较小到特大，共 7 个档位。
 */
export type FontScale = "small" | "compact" | "normal" | "medium" | "large" | "xlarge" | "xxlarge";

/**
 * 字体大小配置预设接口。
 */
export interface FontPreset {
    /** 档位名称 */
    label: string;
    /** 该档位对应的全部 CSS 字号变量及对应尺寸 */
    vars: Record<string, string>;
}

/** 存储字体字号档位设置的 LocalStorage 键名 */
export const FONT_SCALE_KEY = "hlw_font_scale";

/**
 * 字体档位对应的尺寸变量预设表。
 * 每个档位定义了从超小 (--font-xs) 到超大 (--font-xl) 的响应式字号。
 */
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

/**
 * 获取当前用户配置的字体字号缩放档位。
 * 默认返回 'normal'。
 * @returns 字体档位
 */
export function getCurrentFontScale(): FontScale {
    try {
        const v = uni.getStorageSync(FONT_SCALE_KEY);
        if (v === "small" || v === "compact" || v === "medium" || v === "large" || v === "xlarge" || v === "xxlarge") return v;
    } catch {}
    return "normal";
}

/**
 * 获取当前字体字号档位所映射的 CSS 变量表。
 * @returns CSS 变量名与具体字号的键值对
 */
export function getCurrentFontVars(): Record<string, string> {
    return FONT_PRESETS[getCurrentFontScale()].vars;
}
