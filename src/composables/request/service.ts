import { useRequest } from "./client";
import type { ApiResponse, RequestConfig } from "./types";

/**
 * 带有具体必填 URL 的服务请求配置。
 */
export type ServiceRequestConfig = Omit<RequestConfig, "url"> & {
    url: string;
};

/**
 * 命名空间装饰器配置项。
 */
export interface ServiceNamespaceOptions {
    /** 微服务或模块命名空间 */
    namespace: string;
}

/**
 * 服务前缀装饰器配置项。
 */
export interface ServicePrefixOptions {
    /** 基础路径前缀 */
    prefix: string;
}

/**
 * 基础服务抽象类。
 * 业务 Service 类继承此类后，可通过 decorators 注入前缀与命名空间，
 * 并通过便捷方法发起网络请求。
 * 
 * @example
 * ```ts
 * @ServicePrefix('/api')
 * @ServiceNamespace('user')
 * class UserService extends BaseService {
 *   getUserInfo(id: string) {
 *     return this.get(`/info?id=${id}`);
 *   }
 * }
 * ```
 */
export class BaseService {
    /** 当前服务的命名空间（一般由 @ServiceNamespace 注入） */
    declare namespace: string;
    /** 当前服务的基础路径前缀（一般由 @ServicePrefix 注入） */
    declare servicePrefix: string;

    /**
     * 发送服务请求。会自动拼接前缀与命名空间。
     * @param options 请求配置项
     * @returns 响应结果 Promise
     */
    request<T = unknown>(options: ServiceRequestConfig): Promise<ApiResponse<T>> {
        return useRequest().request<T>({
            ...options,
            url: useRequest().resolveServiceUrl(this.namespace ?? "", options.url, this.servicePrefix ?? ""),
        });
    }

    /**
     * 快捷发送 GET 请求。
     * @param url 请求相对路径
     * @param data 请求参数
     */
    get<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "GET", data });
    }

    /**
     * 快捷发送 POST 请求。
     * @param url 请求相对路径
     * @param data 请求携带的 body
     */
    post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "POST", data });
    }

    /**
     * 快捷发送 PUT 请求。
     * @param url 请求相对路径
     * @param data 请求携带的 body
     */
    put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "PUT", data });
    }

    /**
     * 快捷发送 DELETE 请求。
     * @param url 请求相对路径
     * @param data 请求参数
     */
    del<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ url, method: "DELETE", data });
    }
}

/**
 * 服务命名空间类装饰器。
 * 注入 `namespace` 到服务类中。
 * @param value 命名空间名称或配置对象
 */
export function ServiceNamespace(value: string | ServiceNamespaceOptions) {
    return function (target: { prototype: { namespace?: string } }) {
        target.prototype.namespace = typeof value === "string" ? value : value.namespace;
    };
}

/**
 * 服务前缀类装饰器。
 * 注入 `servicePrefix` 到服务类中。
 * @param value 前缀值或配置对象
 */
export function ServicePrefix(value: string | ServicePrefixOptions) {
    return function (target: { prototype: { servicePrefix?: string } }) {
        target.prototype.servicePrefix = typeof value === "string" ? value : value.prefix;
    };
}

/**
 * 插件服务类装饰器。
 * 自动使用 `import.meta.env.VITE_PLUGIN_NAME` 作为服务前缀（通过 globalThis 动态读取）。
 */
export function PluginService(target: any) {
    Object.defineProperty(target.prototype, "servicePrefix", {
        get() {
            return globalThis.VITE_PLUGIN_NAME || "";
        },
        enumerable: true,
        configurable: true
    });
}

