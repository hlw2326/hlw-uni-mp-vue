export { useRequest, useUpload } from "./client";
export { BaseService, ServiceNamespace, ServicePrefix, PluginService } from "./service";
export type { RequestClient } from "./client";
export type {
    ApiResponse,
    PageResult,
    RequestConfig,
    RequestInterceptor,
    ResponseInterceptor,
    ErrorInterceptor,
    UploadConfig,
    UploadResult,
} from "./types";
export type { ServiceNamespaceOptions, ServicePrefixOptions, ServiceRequestConfig } from "./service";
export * from "./adapters";
