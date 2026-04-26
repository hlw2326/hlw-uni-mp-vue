/**
 * UUID v4 生成器（RFC 4122 v4 算法），返回 32 字符 hex（无连字符）。
 *
 * 用途：当 nonce、idempotency key、临时唯一标识用。
 *
 * 算法：
 *   1. 生成 16 字节随机源
 *   2. byte 6 高 4 位置成 0100 标版本号 v4
 *   3. byte 8 高 2 位置成 10 标变体（RFC 4122）
 *   4. 16 字节转 hex 拼成 32 字符串
 *
 * 注意：随机源用 Math.random（小程序兼容兜底），加密强度有限，
 * 不能用于密钥派生 / token 签发，只能挡重放。
 */
export function useUuid() {
    function v4(): string {
        const bytes: number[] = [];
        for (let i = 0; i < 16; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    return { v4 };
}
