import { useRequest } from "./client";
import type { ApiResponse, RequestConfig } from "./types";

export type ServiceRequestConfig = Omit<RequestConfig, "url"> & {
    url: string;
};

export interface ServiceNamespaceOptions {
    namespace: string;
}

export interface ServicePrefixOptions {
    prefix: string;
}

export class BaseService {
    declare namespace: string;
    declare servicePrefix: string;

    request<T = unknown>(options: ServiceRequestConfig): Promise<ApiResponse<T>> {
        return useRequest().request<T>({
            ...options,
            url: useRequest().resolveServiceUrl(this.namespace ?? "", options.url, this.servicePrefix ?? ""),
        });
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
}

export function ServiceNamespace(value: string | ServiceNamespaceOptions) {
    return function (target: { prototype: { namespace?: string } }) {
        target.prototype.namespace = typeof value === "string" ? value : value.namespace;
    };
}

export function ServicePrefix(value: string | ServicePrefixOptions) {
    return function (target: { prototype: { servicePrefix?: string } }) {
        target.prototype.servicePrefix = typeof value === "string" ? value : value.prefix;
    };
}
