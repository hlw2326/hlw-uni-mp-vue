/**
 * Adapter 返回值解包：兼容业务方传「已解包 T」或「ThinkAdmin envelope { code, data }」。
 *
 * 业务方写法：
 *   setConfigAd({ getConfig: getAdConfig })            // 直接传 envelope-returning 函数
 *   setConfigAd({ getConfig: async () => myUnwrapped })  // 也支持已解包
 *
 * 鸭子类型识别：raw 是对象且有 number 类型的 code 字段 → 当 envelope 处理。
 */
export type AdapterPayload<T> = T | null | { code: number; data?: T; info?: string };

export function unwrapPayload<T>(raw: AdapterPayload<T>): T | null {
    if (raw == null) return null;
    if (typeof raw === "object" && "code" in raw && typeof (raw as { code: unknown }).code === "number") {
        const env = raw as { code: number; data?: T };
        return env.code === 1 && env.data ? env.data : null;
    }
    return raw as T;
}
