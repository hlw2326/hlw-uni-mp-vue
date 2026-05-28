/**
 * API 统一响应格式
 * 定义服务端接口的标准数据返回格式。
 */
export interface ApiResponse<T = unknown> {
    /** 业务状态码 (例如: 1 代表成功，非 1 代表不同类型的失败) */
    code: number;
    /** 响应的主体数据 */
    data: T;
    /** 响应的文本提示信息（如：操作成功、系统繁忙） */
    info: string;
}

/**
 * 分页请求的标准数据包装格式。
 */
export interface PageResult<T = unknown> {
    /** 分页列表数据 */
    list: T[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页记录条数 */
    pageSize: number;
}

/**
 * HTTP 请求参数配置项。
 */
export interface RequestConfig {
    /** 请求的目标 URL，支持绝对路径或相对 BaseURL 的相对路径 */
    url: string;
    /** 请求的 HTTP 方法，默认 "GET" */
    method?: "GET" | "POST" | "PUT" | "DELETE";
    /** 请求携带的数据载体，GET/DELETE 对应 Query 传参，POST/PUT 对应 Body 传参 */
    data?: unknown;
    /** 自定义请求头 */
    headers?: Record<string, string>;
    /** 请求超时时间，单位毫秒 */
    timeout?: number;
}

/** 
 * 请求拦截器函数定义。
 * 允许在请求被发出前修改请求配置，支持异步处理。
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/** 
 * 响应拦截器函数定义。
 * 允许在响应被接收并传递给业务逻辑前对响应数据做预处理，支持异步处理。
 */
export type ResponseInterceptor<T = unknown> = (res: ApiResponse<T>) => ApiResponse<T> | void | Promise<ApiResponse<T> | void>;

/** 
 * 错误拦截器函数定义。
 * 用于统一捕获和处理网络层或业务层抛出的异常。
 */
export type ErrorInterceptor = (err: Error) => void | Error | Promise<void | Error>;

/**
 * 云存储或文件直传服务配置项。
 */
export interface UploadConfig {
    /** 上传的服务器网关 URL */
    server: string;
    /** 本地待上传的文件路径 (tempFilePath) */
    filePath: string;
    /** 直传服务器接收的文件参数名称，默认自动从 filePath 中截取 */
    fileName?: string;
    /** 云直传供应商类型，支持 'cos' | 'oss' | 'qiniu' | 'alist' | 'local' */
    type: string;
    /** 直传签名凭证所需的一组敏感密钥对（AK、Signature、Token 等） */
    credentials?: Record<string, string>;
    /** 直传时的自定义 HTTP 请求头 */
    header?: Record<string, string>;
    /** 当 type="local" 时，可以通过此属性覆盖 server 参数作为最终上传端点 */
    url?: string;
}

/**
 * 文件上传完成后标准接口解析出的结果。
 */
export interface UploadResult {
    /** 业务状态码 */
    code: number;
    /** 上传提示信息 */
    msg: string;
    /** 上传成功后云端资源的可访问 URL 或文件路径 */
    data: string;
}
