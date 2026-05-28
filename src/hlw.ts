import { useMsg } from '@/core/msg';
import * as utils from '@/utils';

/**
 * 全局 hlw 实例接口定义，聚合了框架的核心能力。
 */
export interface HlwInstance {
  /** 统一的消息提示与模态弹窗管理模块 */
  $msg: ReturnType<typeof useMsg>;
  /** 聚合的常用小程序公共工具函数 */
  $utils: typeof utils;
}

let _msg: ReturnType<typeof useMsg> | null = null;

/**
 * 全局单例 `hlw` 实例，各核心模块在首次读取时延迟初始化并缓存。
 */
export const hlw: HlwInstance = {
  /** 延迟创建消息提示实例。 */
  get $msg() { return (_msg ??= useMsg()); },
  /** 延迟创建通用工具实例。 */
  $utils: utils,
};

