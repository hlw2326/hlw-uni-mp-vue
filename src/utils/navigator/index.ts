/**
 * uni-app 路由跳转工具
 * 封装并统一原生的页面跳转、重定向、Switch Tab、返回、以及打开外部小程序或 WebView 等方法。
 */

/** 页面跳转类型，支持微信小程序的各类路由动作与 WebView/小程序跳转 */
export type NavigateType =
    | "navigateTo"
    | "redirectTo"
    | "switchTab"
    | "reLaunch"
    | "navigateBack"
    | "miniprogram"
    | "webview"
    | (string & {});

/**
 * 路由跳转的额外配置选项。
 */
export interface NavigateOptions {
    /** 发生失败时是否静默不抛出/显示 Toast 提示，默认 false */
    silent?: boolean;
    /** 页面跳转失败时的回调 */
    onFail?: (message: string) => void;
    /** 返回上级页面的层数，仅在 type="navigateBack" 时生效，默认 1 */
    delta?: number;
    /** 打开外部小程序时的页面路径，仅在 type="miniprogram" 时生效 */
    path?: string;
    /** 打开外部小程序的环境版本 (开发/体验/正式)，仅在 type="miniprogram" 时生效 */
    envVersion?: "develop" | "trial" | "release";
    /** 传递给目标小程序的额外数据 */
    extraData?: Record<string, unknown>;
}

type UniFail = { errMsg?: string };

/**
 * 集中处理跳转失败时的提示与回调。
 */
function fail(message: string, options: NavigateOptions = {}) {
    if (!options.silent) {
        uni.showToast({ title: message, icon: "none" });
    }
    options.onFail?.(message);
}

/**
 * 创建符合 uni-app 失败规范的回调处理函数。
 */
function failHandler(target: string, options: NavigateOptions = {}) {
    return (error?: UniFail) => {
        fail(error?.errMsg || `无法跳转：${target}`, options);
    };
}

/**
 * 核心的底层页面路由分发方法。
 * 
 * @param type 跳转动作类型
 * @param url 跳转目标路径或小程序 AppId
 * @param options 额外的控制参数
 */
export function navigate(type: NavigateType = "navigateTo", url = "", options: NavigateOptions = {}) {
    if (type === "navigateBack") {
        uni.navigateBack({ delta: options.delta || 1, fail: failHandler("返回上一页", options) });
        return;
    }

    if (!url) {
        fail("跳转目标未配置", options);
        return;
    }

    const onFail = failHandler(url, options);

    if (type === "redirectTo") {
        uni.redirectTo({ url, fail: onFail });
        return;
    }

    if (type === "switchTab") {
        uni.switchTab({ url, fail: onFail });
        return;
    }

    if (type === "reLaunch") {
        uni.reLaunch({ url, fail: onFail });
        return;
    }

    if (type === "miniprogram") {
        const openMiniProgram = uni.navigateToMiniProgram as
            | ((options: UniApp.NavigateToMiniProgramOptions) => void)
            | undefined;

        if (!openMiniProgram) {
            fail("当前平台不支持打开小程序", options);
            return;
        }

        openMiniProgram({
            appId: url,
            path: options.path || "",
            envVersion: options.envVersion || "release",
            extraData: options.extraData,
            fail: onFail,
        });
        return;
    }

    if (type === "webview") {
        fail(`H5：${url}`, options);
        return;
    }

    uni.navigateTo({ url, animationType: "none", fail: onFail });
}

/** 保留当前页面，跳转到应用内的某个页面 */
export function navigateTo(url: string, options?: NavigateOptions) {
    return navigate("navigateTo", url, options);
}

/** 关闭当前页面，跳转到应用内的某个页面 */
export function redirectTo(url: string, options?: NavigateOptions) {
    return navigate("redirectTo", url, options);
}

/** 跳转到 switchTab 页面，并关闭其他所有非 tabBar 页面 */
export function switchTab(url: string, options?: NavigateOptions) {
    return navigate("switchTab", url, options);
}

/** 关闭所有页面，打开到应用内的某个页面 */
export function reLaunch(url: string, options?: NavigateOptions) {
    return navigate("reLaunch", url, options);
}

/** 关闭当前页面，返回上一页面或多级页面 */
export function navigateBack(delta = 1, options: NavigateOptions = {}) {
    return navigate("navigateBack", "", { ...options, delta });
}

/** 打开另一个小程序 */
export function navigateToMiniProgram(appId: string, options?: NavigateOptions) {
    return navigate("miniprogram", appId, options);
}
