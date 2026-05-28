import { useMsg } from '@/core/msg';
import { getDevice, type DeviceInfo } from '@/utils/device';
import { request, type RequestClient } from '@/utils/request';
import * as utils from '@/utils/common';

/**
 * 全局 hlw 实例接口定义，聚合了框架的核心能力。
 */
export interface HlwInstance {
  /** 统一的消息提示与模态弹窗管理模块 */
  $msg: ReturnType<typeof useMsg>;
  /** 当前运行设备的详细系统信息 */
  $device: DeviceInfo;
  /** 全局配置的统一 HTTP 请求实例 */
  $request: RequestClient;
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
  /** 延迟读取并缓存设备信息。 */
  get $device() { return getDevice(); },
  /** 复用全局请求实例。 */
  $request: request,
  /** 延迟创建通用工具实例。 */
  $utils: utils,
};

