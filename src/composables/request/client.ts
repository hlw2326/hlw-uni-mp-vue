import { ref } from "vue";
import type {
    ApiResponse,
    ErrorInterceptor,
    RequestConfig,
    RequestInterceptor,
    ResponseInterceptor,
    UploadConfig,
    UploadResult,
} from "./types";
import { getAdapter } from "./adapters";

export interface RequestClient {
    request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>>;
    get<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;
    post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;
    put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;
    del<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;
    upload(config: UploadConfig): Promise<UploadResult>;
    setBaseURL(url: string): void;
    resolveServiceUrl(namespace: string, url: string, servicePrefix?: string): string;
    onRequest(fn: RequestInterceptor): () => void;
    onResponse<T = unknown>(fn: ResponseInterceptor<T>): () => void;
    onError(fn: ErrorInterceptor): () => void;
}

class UniRequestClient implements RequestClient {
    private reqInterceptors: RequestInterceptor[] = [];
    private resInterceptors: ResponseInterceptor[] = [];
    private errInterceptors: ErrorInterceptor[] = [];
    private baseURL = "";
    private defaultHeaders: Record<string, string> = { "Content-Type": "application/json" };

    setBaseURL(url: string): void {
        this.baseURL = url;
    }

    onRequest(fn: RequestInterceptor): () => void {
        this.reqInterceptors.push(fn);
        return () => this.remove(this.reqInterceptors, fn);
    }

    onResponse<T = unknown>(fn: ResponseInterceptor<T>): () => void {
        const item = fn as ResponseInterceptor;
        this.resInterceptors.push(item);
        return () => this.remove(this.resInterceptors, item);
    }

    onError(fn: ErrorInterceptor): () => void {
        this.errInterceptors.push(fn);
        return () => this.remove(this.errInterceptors, fn);
    }

    async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
        let cfg: RequestConfig = {
            method: "GET",
            ...config,
            headers: { ...this.defaultHeaders, ...config.headers },
        };

        for (const fn of this.reqInterceptors) {
            cfg = await fn(cfg);
        }

        try {
            const res = await this.send<T>(this.resolveUrl(cfg.url), cfg);
            for (const fn of this.resInterceptors) {
                const next = await fn(res as ApiResponse<unknown>);
                if (next !== undefined) return next as ApiResponse<T>;
            }
            return res;
        } catch (e) {
            const err = e as Error;
            for (const fn of this.errInterceptors) {
                await fn(err);
            }
            throw err;
        }
    }

    get<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "GET", data });
    }

    post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "POST", data });
    }

    put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "PUT", data });
    }

    del<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "DELETE", data });
    }

    upload(config: UploadConfig): Promise<UploadResult> {
        const fileName = config.fileName ?? config.filePath.split("/").pop() ?? "file";
        const server = config.type === "local" && config.url ? config.url : config.server;
        const formData = config.type === "local"
            ? (config.credentials ?? {})
            : getAdapter(config.type).buildFormData({
                filePath: config.filePath,
                fileName,
                credentials: config.credentials,
            });

        return new Promise((resolve, reject) => {
            uni.uploadFile({
                url: server,
                filePath: config.filePath,
                name: "file",
                formData: formData as unknown as UniNamespace.UploadFileOption["formData"],
                header: config.header as Record<string, string>,
                success: (res) => {
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        reject(new Error(`上传失败: ${res.statusCode}`));
                        return;
                    }

                    try {
                        const body = JSON.parse(res.data);
                        resolve({
                            code: body.code ?? 1,
                            msg: body.msg ?? body.message ?? "上传成功",
                            data: body.data ?? "",
                        });
                    } catch {
                        resolve({ code: 1, msg: "上传成功", data: res.data });
                    }
                },
                fail: (err) => reject(new Error(err.errMsg || "上传失败")),
            });
        });
    }

    resolveServiceUrl(namespace: string, url: string, servicePrefix = ""): string {
        if (isAbsolute(url)) return url;

        const ns = namespace.replace(/^\/+|\/+$/g, "").replace(/\//g, ".");
        const prefixValue = servicePrefix.replace(/^\/+|\/+$/g, "");
        const path = url.startsWith("/") ? url : `/${url}`;
        const prefix = [prefixValue, ns].filter(Boolean).join("/");

        return prefix ? `/${prefix}${path}` : path;
    }

    private resolveUrl(url: string): string {
        if (isAbsolute(url)) return url;
        return `${this.baseURL}${url}`;
    }

    private send<T>(url: string, cfg: RequestConfig): Promise<ApiResponse<T>> {
        return new Promise((resolve, reject) => {
            uni.request({
                url,
                method: cfg.method,
                data: cfg.data as UniNamespace.RequestOptions["data"],
                header: cfg.headers as Record<string, string>,
                timeout: cfg.timeout,
                success: (res) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(res.data as ApiResponse<T>);
                        return;
                    }

                    const body = res.data as Record<string, unknown> | undefined;
                    reject(new Error(String(body?.info ?? body?.message ?? `请求失败: ${res.statusCode}`)));
                },
                fail: (err) => reject(new Error(err.errMsg || "网络请求失败")),
            });
        });
    }

    private remove<T>(items: T[], item: T): void {
        const index = items.indexOf(item);
        if (index > -1) items.splice(index, 1);
    }
}

function isAbsolute(url: string): boolean {
    return /^(https?:)?\/\//.test(url) || url.startsWith("file://");
}

const requestClient = new UniRequestClient();

export function useRequest(): RequestClient {
    return requestClient;
}

export function useUpload() {
    const uploading = ref(false);

    async function upload(options: UploadConfig): Promise<UploadResult> {
        uploading.value = true;
        try {
            return await requestClient.upload(options);
        } finally {
            uploading.value = false;
        }
    }

    return { uploading, upload };
}
