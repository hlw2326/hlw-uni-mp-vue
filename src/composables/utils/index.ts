/**
 * 小程序通用工具。
 */

export interface DownloadFileOptions {
    /** 下载地址 */
    url: string;
    /** 文件保存路径，可选 */
    filePath?: string;
    /** HTTP 请求头，可选 */
    header?: Record<string, string>;
    /** 下载进度回调，可选 */
    onProgress?: (progress: number, totalBytesWritten: number, totalBytesExpectedToWrite: number) => void;
}

export interface DownloadFileResult {
    /** 是否成功 */
    success: boolean;
    /** 临时文件路径 */
    tempFilePath?: string;
    /** 状态码 */
    statusCode?: number;
    /** 错误信息 */
    errMsg?: string;
}

function appendQuery(url: string, query: string) {
    if (!query) return url;
    return `${url}${url.includes("?") ? "&" : "?"}${query}`;
}

function toQuery(data: Record<string, unknown>) {
    return Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");
}

function signText(url: string) {
    const [path, query] = url.split("?");
    return query ? `${query.split("&").filter(Boolean).sort().join("&")}&` : `${path}&`;
}

function toNumber(value: unknown, fallback: number): number {
    const next = Number(value);
    return Number.isFinite(next) ? next : fallback;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
    if (typeof value === "boolean") return value;
    if (value === 0 || value === "0") return false;
    if (value === 1 || value === "1") return true;
    return fallback;
}

/**
 * 剪贴板、下载与相册保存工具集合。
 */
export function useUtils() {
    /**
     * 复制文本到剪贴板，可选显示成功提示。
     */
    function copy(data: string, showToast = true): Promise<boolean> {
        return new Promise((resolve) => {
            uni.setClipboardData({
                data,
                showToast: false,
                success: () => {
                    if (showToast) {
                        uni.showToast({ title: "复制成功", icon: "none", duration: 1500 });
                    }
                    resolve(true);
                },
                fail: () => resolve(false),
            });
        });
    }

    /**
     * 读取当前剪贴板文本内容。
     */
    function paste(): Promise<string> {
        return new Promise((resolve) => {
            uni.getClipboardData({
                success: (res) => resolve(res.data),
                fail: () => resolve(""),
            });
        });
    }

    /**
     * 将本地图片保存到系统相册。
     */
    function saveImage(filePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            uni.saveImageToPhotosAlbum({
                filePath,
                success: () => {
                    uni.showToast({ title: "保存成功", icon: "success" });
                    resolve(true);
                },
                fail: (err) => {
                    if (err.errMsg.includes("auth deny") || err.errMsg.includes("authorize")) {
                        uni.showModal({
                            title: "提示",
                            content: "需要授权相册权限",
                            confirmText: "去设置",
                            success: (res) => {
                                if (res.confirm) uni.openSetting();
                            },
                        });
                    } else {
                        uni.showToast({ title: "保存失败", icon: "none" });
                    }
                    resolve(false);
                },
            });
        });
    }

    /**
     * 将本地视频保存到系统相册。
     */
    function saveVideo(filePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            uni.saveVideoToPhotosAlbum({
                filePath,
                success: () => {
                    uni.showToast({ title: "保存成功", icon: "success" });
                    resolve(true);
                },
                fail: (err) => {
                    if (err.errMsg.includes("auth deny") || err.errMsg.includes("authorize")) {
                        uni.showModal({
                            title: "提示",
                            content: "需要授权相册权限",
                            confirmText: "去设置",
                            success: (res) => {
                                if (res.confirm) uni.openSetting();
                            },
                        });
                    } else {
                        uni.showToast({ title: "保存失败", icon: "none" });
                    }
                    resolve(false);
                },
            });
        });
    }

    /**
     * 下载文件并返回下载结果。
     */
    function downloadFile(options: DownloadFileOptions): Promise<DownloadFileResult> {
        return new Promise((resolve) => {
            const task = uni.downloadFile({
                url: options.url,
                filePath: options.filePath,
                header: options.header,
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve({ success: true, tempFilePath: res.tempFilePath, statusCode: res.statusCode });
                    } else {
                        resolve({ success: false, statusCode: res.statusCode, errMsg: `下载失败，状态码：${res.statusCode}` });
                    }
                },
                fail: (err) => resolve({ success: false, errMsg: err.errMsg }),
            });

            if (options.onProgress) {
                task.onProgressUpdate((res) => {
                    options.onProgress!(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite);
                });
            }
        });
    }

    /**
     * 下载远程图片并直接保存到相册。
     */
    async function downloadAndSaveImage(url: string, onProgress?: (progress: number) => void): Promise<boolean> {
        try {
            uni.showLoading({ title: "下载中...", mask: true });

            const result = await downloadFile({
                url,
                onProgress: onProgress ? (progress) => onProgress(progress) : undefined,
            });

            uni.hideLoading();

            if (!result.success || !result.tempFilePath) {
                uni.showToast({ title: result.errMsg || "下载失败", icon: "none" });
                return false;
            }

            return await saveImage(result.tempFilePath);
        } catch {
            uni.hideLoading();
            uni.showToast({ title: "操作失败", icon: "none" });
            return false;
        }
    }

    /**
     * 下载远程视频并直接保存到相册。
     */
    async function downloadAndSaveVideo(url: string, onProgress?: (progress: number) => void): Promise<boolean> {
        try {
            uni.showLoading({ title: "下载中...", mask: true });

            const result = await downloadFile({
                url,
                onProgress: onProgress ? (progress) => onProgress(progress) : undefined,
            });

            uni.hideLoading();

            if (!result.success || !result.tempFilePath) {
                uni.showToast({ title: result.errMsg || "下载失败", icon: "none" });
                return false;
            }

            return await saveVideo(result.tempFilePath);
        } catch {
            uni.hideLoading();
            uni.showToast({ title: "操作失败", icon: "none" });
            return false;
        }
    }

    return {
        copy,
        paste,
        saveImage,
        saveVideo,
        downloadFile,
        downloadAndSaveImage,
        downloadAndSaveVideo,
        appendQuery,
        toQuery,
        signText,
        toNumber,
        toBoolean,
    };
}
