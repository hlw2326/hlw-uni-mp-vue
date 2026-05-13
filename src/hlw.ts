/**
 * hlw - 全局命名空间工厂
 * 提供 $msg、$device、$request、$utils 的统一访问入口。
 */
import { useMsg } from '@/composables/msg';
import { useDevice, type DeviceInfo } from '@/composables/device';
import { useRequest } from '@/composables/request';
import { useUtils } from '@/composables/utils';

export interface HlwInstance {
  $msg: ReturnType<typeof useMsg>;
  $device: DeviceInfo;
  $request: ReturnType<typeof useRequest>;
  $utils: ReturnType<typeof useUtils>;
}

let _msg: ReturnType<typeof useMsg> | null = null;
let _utils: ReturnType<typeof useUtils> | null = null;

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
