/**
 * 设备信息与接口 query
 * 提供一致的、缓存后的多端设备系统信息接口。
 */
import { toQuery } from "../common";

/**
 * 完整设备系统信息接口，包含小程序环境与宿主系统的关键元数据。
 */
export interface DeviceInfo {
    /** 小程序 appId */
    appid: string;
    /** 应用名称 */
    app_name: string;
    /** 小程序版本号（版本名称） */
    version: string;
    /** 小程序版本号（版本号） */
    version_code: string;
    /** 小程序来源渠道 */
    channel: string;
    /** 设备 brand。如：apple、huawei */
    device_brand: string;
    /** 设备型号 */
    device_model: string;
    /** 设备 ID */
    device_id: string;
    /** 设备类型：phone/pad/pc */
    device_type: string;
    /** 设备方向：portrait/landscape */
    device_orientation: "portrait" | "landscape";
    /** 手机品牌。H5 不支持 */
    brand: string;
    /** 手机型号 */
    model: string;
    /** 操作系统版本 */
    system: string;
    /** 操作系统版本（简写） */
    os: string;
    /** 设备像素比 */
    pixel_ratio: number;
    /** 屏幕宽度 (px) */
    screen_width: number;
    /** 屏幕高度 (px) */
    screen_height: number;
    /** 可用窗口宽度 (px) */
    window_width: number;
    /** 可用窗口高度 (px) */
    window_height: number;
    /** 状态栏高度 (px) */
    status_bar_height: number;
    /** 微信基础库版本 */
    sdk_version: string;
    /** 宿主名称。如：WeChat、alipay */
    host_name: string;
    /** 宿主版本。如：微信版本号 */
    host_version: string;
    /** 宿主语言 */
    host_language: string;
    /** 宿主主题：light/dark */
    host_theme: string;
    /** 平台类型 weapp/toutiao/h5 */
    platform: string;
    /** 客户端语言 */
    language: string;
}

/**
 * 过滤后常用于接口公共请求 Query 的设备字段子集。
 */
export type DeviceQueryInfo = Pick<
    DeviceInfo,
    "appid" | "device_brand" | "device_model" | "device_id" | "device_type" | "device_orientation" | "platform" | "system" | "os" | "sdk_version" | "host_name" | "host_version" | "host_language" | "language" | "version" | "version_code" | "channel" | "screen_width" | "screen_height"
>;

let deviceCache: DeviceInfo | null = null;

/**
 * 安全地执行获取系统信息的函数，防止环境不支持导致异常崩溃。
 */
function readSafe(fn: (() => unknown) | undefined): Record<string, unknown> {
    try {
        return (fn?.() ?? {}) as Record<string, unknown>;
    } catch {
        return {};
    }
}

/**
 * 从运行期 API 采集设备与系统属性，建立标准化数据。
 */
function collectDevice(): DeviceInfo {
    // @ts-ignore - 新 API 在旧版 @dcloudio/types 中可能未声明。
    let device = readSafe(uni.getDeviceInfo);
    // @ts-ignore
    let window = readSafe(uni.getWindowInfo);
    let app = readSafe(uni.getAppBaseInfo);

    if (!device.brand && !device.model) {
        const system = readSafe(() => uni.getSystemInfoSync());
        device = { ...system };
        window = { ...system };
        app = { ...system };
    }

    const system = (device.system as string) || "";

    return {
        appid: getAppid(device),
        app_name: (app.appName as string) || "",
        version: (app.appVersion as string) || "",
        version_code: (app.appVersionCode as string) || "",
        channel: (app.appChannel as string) || "",
        device_brand: (device.brand as string) || "",
        device_model: (device.model as string) || "",
        device_id: (device.deviceId as string) || "",
        device_type: (device.deviceType as string) || "",
        device_orientation: (window.deviceOrientation as "portrait" | "landscape") || "portrait",
        brand: (device.brand as string) || "",
        model: (device.model as string) || "",
        system,
        os: system.split(" ")[0] || "",
        pixel_ratio: (window.pixelRatio as number) || 0,
        screen_width: (window.screenWidth as number) || 0,
        screen_height: (window.screenHeight as number) || 0,
        window_width: (window.windowWidth as number) || 0,
        window_height: (window.windowHeight as number) || 0,
        status_bar_height: (window.statusBarHeight as number) || 0,
        sdk_version: (app.SDKVersion as string) || "",
        host_name: (app.hostName as string) || "",
        host_version: (app.hostVersion as string) || "",
        host_language: (app.hostLanguage as string) || "",
        host_theme: (app.hostTheme as string) || "",
        platform: (device.platform as string) || "",
        language: (app.language as string) || "",
    };
}

/**
 * 尝试从小程序运行期 context 中读取 AppId。
 */
function getAppid(device: Record<string, unknown>) {
    try {
        const account = uni.getAccountInfoSync() as { miniProgram?: { appId?: string } };
        return account?.miniProgram?.appId || "";
    } catch {
        return (device.appId as string) || "";
    }
}

/**
 * 抽取供接口调用的缩略版设备 query 字段。
 */
function getQueryInfo(info: DeviceInfo): DeviceQueryInfo {
    return {
        appid: info.appid,
        device_brand: info.device_brand,
        device_model: info.device_model,
        device_id: info.device_id,
        device_type: info.device_type,
        device_orientation: info.device_orientation,
        platform: info.platform,
        system: info.system,
        os: info.os,
        sdk_version: info.sdk_version,
        host_name: info.host_name,
        host_version: info.host_version,
        host_language: info.host_language,
        language: info.language,
        version: info.version,
        version_code: info.version_code,
        channel: info.channel,
        screen_width: info.screen_width,
        screen_height: info.screen_height,
    };
}

/**
 * 获取缓存后的设备信息数据。
 */
export function getDevice(): DeviceInfo {
    deviceCache ??= collectDevice();
    return deviceCache;
}

/**
 * 获取接口请求专用的设备信息 query 字符串。
 */
export function getDeviceQuery(): string {
    return toQuery(getQueryInfo(getDevice()));
}

/**
 * 清除本地设备信息缓存，使下一次读取重新走系统调用收集。
 */
export function clearDeviceCache(): void {
    deviceCache = null;
}
