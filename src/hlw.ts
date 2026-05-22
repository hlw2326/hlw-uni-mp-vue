/**
 * hlw - 全局命名空间工厂
 * 提供 $msg、$device、$request、$utils 的统一访问入口。
 */
import { useMsg } from '@/composables/msg';
import { useDevice, type DeviceInfo } from '@/composables/device';
import { useRequest } from '@/composables/request';
import { useUtils } from '@/composables/utils';

/**
 * 全局 hlw 实例接口定义，聚合了框架的核心能力。
 */
export interface HlwInstance {
  /** 统一的消息提示与模态弹窗管理模块 */
  $msg: ReturnType<typeof useMsg>;
  /** 当前运行设备的详细系统信息 */
  $device: DeviceInfo;
  /** 全局配置的统一 HTTP 请求实例 */
  $request: ReturnType<typeof useRequest>;
  /** 聚合的常用小程序公共工具函数 */
  $utils: ReturnType<typeof useUtils>;
}

let _msg: ReturnType<typeof useMsg> | null = null;
let _utils: ReturnType<typeof useUtils> | null = null;

/**
 * 全局单例 `hlw` 实例，各核心模块在首次读取时延迟初始化并缓存。
 */
export const hlw: HlwInstance = {
  /** 延迟创建消息提示实例。 */
  get $msg() { return (_msg ??= useMsg()); },
  /** 延迟读取并缓存设备信息。 */
  get $device() { return useDevice().info; },
  /** 复用全局请求实例。 */
  $request: useRequest(),
  /** 延迟创建通用工具实例。 */
  get $utils() { return (_utils ??= useUtils()); },
};

