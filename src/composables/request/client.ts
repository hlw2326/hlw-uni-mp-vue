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

/**
 * HTTP 请求客户端接口定义。
 * 提供基础的 HTTP 请求方法、文件直传服务配置以及拦截器管理。
 */
export interface RequestClient {
    /**
     * 发送网络请求。
     * @param config 请求配置项
     * @returns 封装后的响应结果 Promise
     */
    request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>>;

    /**
     * 发送 GET 请求的快捷方法。
     * @param url 请求的目标 URL
     * @param data 请求携带的 query 参数
     * @returns 封装后的响应结果 Promise
     */
    get<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;

    /**
     * 发送 POST 请求的快捷方法。
     * @param url 请求的目标 URL
     * @param data 请求携带的 body 数据
     * @returns 封装后的响应结果 Promise
     */
    post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;

    /**
     * 发送 PUT 请求的快捷方法。
     * @param url 请求的目标 URL
     * @param data 请求携带的 body 数据
     * @returns 封装后的响应结果 Promise
     */
    put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;

    /**
     * 发送 DELETE 请求的快捷方法。
     * @param url 请求的目标 URL
     * @param data 请求携带的 query 或 body 数据
     * @returns 封装后的响应结果 Promise
     */
    del<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>>;

    /**
     * 上传本地文件到服务器或第三方云存储。
     * @param config 文件上传配置项
     * @returns 上传解析结果 Promise
     */
    upload(config: UploadConfig): Promise<UploadResult>;

    /**
     * 设置基础请求域名或前缀。
     * @param url 域名字符串（如 'https://api.example.com'）
     */
    setBaseURL(url: string): void;

    /**
     * 拼接并解析微服务模块或命名空间下的请求 URL。
     * @param namespace 命名空间/模块名称
     * @param url 具体的接口路径
     * @param servicePrefix 服务的前缀，可选
     * @returns 拼接完成的完整路径
     */
    resolveServiceUrl(namespace: string, url: string, servicePrefix?: string): string;

    /**
     * 注册请求拦截器，在请求发出前触发。
     * @param fn 拦截器处理函数
     * @returns 用于注销该拦截器的注销函数
     */
    onRequest(fn: RequestInterceptor): () => void;

    /**
     * 注册响应拦截器，在成功接收响应后触发。
     * @param fn 拦截器处理函数
     * @returns 用于注销该拦截器的注销函数
     */
    onResponse<T = unknown>(fn: ResponseInterceptor<T>): () => void;

    /**
     * 注册错误拦截器，在请求或响应阶段发生异常时触发。
     * @param fn 错误拦截处理器
     * @returns 用于注销该拦截器的注销函数
     */
    onError(fn: ErrorInterceptor): () => void;
}

/**
 * UniApp 请求客户端的实现类。
 * 基于 uni.request 与 uni.uploadFile 封装，内置拦截器调用链路。
 */
class UniRequestClient implements RequestClient {
    private reqInterceptors: RequestInterceptor[] = [];
    private resInterceptors: ResponseInterceptor[] = [];
    private errInterceptors: ErrorInterceptor[] = [];
    private baseURL = "";
    private defaultHeaders: Record<string, string> = { "Content-Type": "application/json" };

    /**
     * 设置全局基础请求 URL。
     */
    setBaseURL(url: string): void {
        this.baseURL = url;
    }

    /**
     * 注册一个请求拦截器。
     */
    onRequest(fn: RequestInterceptor): () => void {
        this.reqInterceptors.push(fn);
        return () => this.remove(this.reqInterceptors, fn);
    }

    /**
     * 注册一个响应拦截器。
     */
    onResponse<T = unknown>(fn: ResponseInterceptor<T>): () => void {
        const item = fn as ResponseInterceptor;
        this.resInterceptors.push(item);
        return () => this.remove(this.resInterceptors, item);
    }

    /**
     * 注册一个错误拦截器。
     */
    onError(fn: ErrorInterceptor): () => void {
        this.errInterceptors.push(fn);
        return () => this.remove(this.errInterceptors, fn);
    }

    /**
     * 执行 HTTP 请求。
     */
    async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
        let cfg: RequestConfig = {
            method: "GET",
            ...config,
            headers: { ...this.defaultHeaders, ...config.headers },
        };

        // 顺序执行请求拦截器
        for (const fn of this.reqInterceptors) {
            cfg = await fn(cfg);
        }

        try {
            const res = await this.send<T>(this.resolveUrl(cfg.url), cfg);
            // 顺序执行响应拦截器
            for (const fn of this.resInterceptors) {
                const next = await fn(res as ApiResponse<unknown>);
                if (next !== undefined) return next as ApiResponse<T>;
            }
            return res;
        } catch (e) {
            const err = e as Error;
            // 执行错误拦截器
            for (const fn of this.errInterceptors) {
                await fn(err);
            }
            throw err;
        }
    }

    /**
     * 发送 GET 请求。
     */
    get<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "GET", data });
    }

    /**
     * 发送 POST 请求。
     */
    post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "POST", data });
    }

    /**
     * 发送 PUT 请求。
     */
    put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "PUT", data });
    }

    /**
     * 发送 DELETE 请求。
     */
    del<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "DELETE", data });
    }

    /**
     * 上传本地文件，适配云存储（COS/OSS/七牛/Alist）或本地直传。
     */
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

    /**
     * 解析微服务风格的命名空间 URL。
     */
    resolveServiceUrl(namespace: string, url: string, servicePrefix = ""): string {
        if (isAbsolute(url)) return url;

        const ns = namespace.replace(/^\/+|\/+$/g, "").replace(/\//g, ".");
        const prefixValue = servicePrefix.replace(/^\/+|\/+$/g, "");
        const path = url.startsWith("/") ? url : `/${url}`;
        const prefix = [prefixValue, ns].filter(Boolean).join("/");

        return prefix ? `/${prefix}${path}` : path;
    }

    /**
     * 内部拼接基础 URL 与相对路径。
     */
    private resolveUrl(url: string): string {
        if (isAbsolute(url)) return url;
        return `${this.baseURL}${url}`;
    }

    /**
     * 内部基于 uni.request 发送网络请求的方法。
     */
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

    /**
     * 从数组中安全移除某个拦截器实例。
     */
    private remove<T>(items: T[], item: T): void {
        const index = items.indexOf(item);
        if (index > -1) items.splice(index, 1);
    }
}

/**
 * 判断 URL 是否为绝对路径（支持 http://, https://, file://）。
 */
function isAbsolute(url: string): boolean {
    return /^(https?:)?\/\//.test(url) || url.startsWith("file://");
}

const requestClient = new UniRequestClient();

/**
 * 获取全局请求客户端单例。
 * 
 * @example
 * ```ts
 * const http = useRequest();
 * http.setBaseURL('https://api.example.com');
 * ```
 */
export function useRequest(): RequestClient {
    return requestClient;
}

/**
 * 文件上传 composable。
 * 提供 `uploading` 状态与上传方法。
 * 
 * @example
 * ```ts
 * const { uploading, upload } = useUpload();
 * const res = await upload({
 *   type: 'oss',
 *   filePath: 'temp-path',
 *   server: 'https://oss-endpoint.com'
 * });
 * ```
 */
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
