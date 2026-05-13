/**
 * 小程序通用工具。
 */

export interface DownloadOpt {
    url: string;
    path?: string;
    header?: Record<string, string>;
    progress?: (value: number, done: number, total: number) => void;
}

export interface DownloadRes {
    ok: boolean;
    path?: string;
    code?: number;
    msg?: string;
}

function withQuery(url: string, qs: string) {
    if (!qs) return url;
    return `${url}${url.includes("?") ? "&" : "?"}${qs}`;
}

function toQuery(data: Record<string, unknown>) {
    return Object.entries(data)
        .filter(([, val]) => val !== undefined && val !== null)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
        .join("&");
}

function signText(url: string) {
    const [path, qs] = url.split("?");
    return qs ? `${qs.split("&").filter(Boolean).sort().join("&")}&` : `${path}&`;
}

function toNumber(val: unknown, def: number): number {
    const next = Number(val);
    return Number.isFinite(next) ? next : def;
}

function toBoolean(val: unknown, def: boolean): boolean {
    if (typeof val === "boolean") return val;
    if (val === 0 || val === "0") return false;
    if (val === 1 || val === "1") return true;
    return def;
}

export function useUtils() {
    function copy(text: string, tip = true): Promise<boolean> {
        return new Promise((ok) => {
            uni.setClipboardData({
                data: text,
                showToast: false,
                success: () => {
                    if (tip) {
                        uni.showToast({ title: "复制成功", icon: "none", duration: 1500 });
                    }
                    ok(true);
                },
                fail: () => ok(false),
            });
        });
    }

    function paste(): Promise<string> {
        return new Promise((ok) => {
            uni.getClipboardData({
                success: (res) => ok(res.data),
                fail: () => ok(""),
            });
        });
    }

    function auth() {
        uni.showModal({
            title: "提示",
            content: "需要授权相册权限",
            confirmText: "去设置",
            success: (res) => {
                if (res.confirm) uni.openSetting();
            },
        });
    }

    function saveImage(path: string): Promise<boolean> {
        return new Promise((ok) => {
            uni.saveImageToPhotosAlbum({
                filePath: path,
                success: () => {
                    uni.showToast({ title: "保存成功", icon: "success" });
                    ok(true);
                },
                fail: (err) => {
                    const msg = String(err.errMsg || "");
                    if (msg.includes("auth deny") || msg.includes("authorize")) {
                        auth();
                    } else {
                        uni.showToast({ title: "保存失败", icon: "none" });
                    }
                    ok(false);
                },
            });
        });
    }

    function saveVideo(path: string): Promise<boolean> {
        return new Promise((ok) => {
            uni.saveVideoToPhotosAlbum({
                filePath: path,
                success: () => {
                    uni.showToast({ title: "保存成功", icon: "success" });
                    ok(true);
                },
                fail: (err) => {
                    const msg = String(err.errMsg || "");
                    if (msg.includes("auth deny") || msg.includes("authorize")) {
                        auth();
                    } else {
                        uni.showToast({ title: "保存失败", icon: "none" });
                    }
                    ok(false);
                },
            });
        });
    }

    function download(opt: DownloadOpt): Promise<DownloadRes> {
        return new Promise((ok) => {
            const task = uni.downloadFile({
                url: opt.url,
                filePath: opt.path,
                header: opt.header,
                success: (res) => {
                    if (res.statusCode === 200) {
                        ok({ ok: true, path: res.tempFilePath, code: res.statusCode });
                    } else {
                        ok({ ok: false, code: res.statusCode, msg: `下载失败，状态码：${res.statusCode}` });
                    }
                },
                fail: (err) => ok({ ok: false, msg: err.errMsg }),
            });

            if (opt.progress) {
                task.onProgressUpdate((res) => {
                    opt.progress!(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite);
                });
            }
        });
    }

    async function saveImageUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
        try {
            uni.showLoading({ title: "下载中...", mask: true });
            const res = await download({ url, progress: progress ? (value) => progress(value) : undefined });
            uni.hideLoading();

            if (!res.ok || !res.path) {
                uni.showToast({ title: res.msg || "下载失败", icon: "none" });
                return false;
            }

            return await saveImage(res.path);
        } catch {
            uni.hideLoading();
            uni.showToast({ title: "操作失败", icon: "none" });
            return false;
        }
    }

    async function saveVideoUrl(url: string, progress?: (value: number) => void): Promise<boolean> {
        try {
            uni.showLoading({ title: "下载中...", mask: true });
            const res = await download({ url, progress: progress ? (value) => progress(value) : undefined });
            uni.hideLoading();

            if (!res.ok || !res.path) {
                uni.showToast({ title: res.msg || "下载失败", icon: "none" });
                return false;
            }

            return await saveVideo(res.path);
        } catch {
            uni.hideLoading();
            uni.showToast({ title: "操作失败", icon: "none" });
            return false;
        }
    }

    return {
        withQuery,
        toQuery,
        signText,
        toNumber,
        toBoolean,
        copy,
        paste,
        saveImage,
        saveVideo,
        download,
        saveImageUrl,
        saveVideoUrl,
    };
}
