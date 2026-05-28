/**
 * @hlw-uni/mp-vue 统一导出
 *
 * 2.0 起合并了原 @hlw-uni/mp-core 全部内容。
 * 业务方一处 import，无需再分包：
 *   import { useMsg, useTheme, ... } from "@hlw-uni/mp-vue";
 *
 * UI 组件（hlw-page / hlw-button / hlw-ad 等）走 easycom 自动注册，不在这里 export。
 */

// Core / 工具
export * from "./core";
export * from "./utils/ad";
export * from "./utils/utils";
export * from "./utils/navigator";
export * from "./utils/device";
export * from "./utils/request";

// 类型
export type { HlwMenuItem } from "./components/hlw-menu/types";
export type { HlwPagingRef, HlwPagingInstance } from "./components/hlw-paging/types";

// App 根上下文
export { useApp } from "./app";

// hlw 全局命名空间
export { hlw, type HlwInstance } from "./hlw";

// 指令
export { vCopy } from "./directives";
