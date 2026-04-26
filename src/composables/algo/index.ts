/**
 * 算法集：把通用算法包成 useXxx composable，业务侧统一从这里取。
 *
 * 已有：
 *   - useUuid  RFC 4122 v4，32 字符 hex
 */
export { useUuid } from "./uuid";
