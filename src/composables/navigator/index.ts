/**
 * useNavigate - uni-app 跳转工具
 */
export type NavigateType =
    | "navigateTo"
    | "redirectTo"
    | "switchTab"
    | "reLaunch"
    | "navigateBack"
    | "miniprogram"
    | "webview"
    | (string & {});

export interface NavigateOptions {
    silent?: boolean;
    onFail?: (message: string) => void;
    delta?: number;
    path?: string;
    envVersion?: "develop" | "trial" | "release";
    extraData?: Record<string, unknown>;
}

type UniFail = { errMsg?: string };

function fail(message: string, options: NavigateOptions = {}) {
    if (!options.silent) {
        uni.showToast({ title: message, icon: "none" });
    }
    options.onFail?.(message);
}

function failHandler(target: string, options: NavigateOptions = {}) {
    return (error?: UniFail) => {
        fail(error?.errMsg || `无法跳转：${target}`, options);
    };
}

function navigate(type: NavigateType = "navigateTo", url = "", options: NavigateOptions = {}) {
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

    uni.navigateTo({ url, fail: onFail });
}

export function useNavigate() {
    return {
        navigate,
        to: (url: string, options?: NavigateOptions) => navigate("navigateTo", url, options),
        redirect: (url: string, options?: NavigateOptions) => navigate("redirectTo", url, options),
        tab: (url: string, options?: NavigateOptions) => navigate("switchTab", url, options),
        reLaunch: (url: string, options?: NavigateOptions) => navigate("reLaunch", url, options),
        back: (delta = 1, options: NavigateOptions = {}) => navigate("navigateBack", "", { ...options, delta }),
        miniProgram: (appId: string, options?: NavigateOptions) => navigate("miniprogram", appId, options),
    };
}
