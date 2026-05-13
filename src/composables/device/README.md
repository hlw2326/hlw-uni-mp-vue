# device 调用文档

`useDevice` 采集并缓存设备、窗口、宿主和小程序信息，同时提供常用设备字段组成的 query 字符串。

## 引入

```ts
import { useDevice, clearDeviceCache } from "@hlw-uni/mp-vue";
```

## 基础用法

```ts
const { info, query } = useDevice();

console.log(info.appid);
console.log(info.device_model);
console.log(query);
```

`useDevice` 内部会优先读取 `uni.getDeviceInfo`、`uni.getWindowInfo`、`uni.getAppBaseInfo`，旧环境会回退到 `uni.getSystemInfoSync`。

## 清除缓存

```ts
clearDeviceCache();
```

切换账号、切换宿主环境或需要重新采集设备信息时可以手动清理缓存。

## 返回值

| 字段 | 说明 |
| --- | --- |
| `info` | 完整 `DeviceInfo` |
| `query` | 常用设备字段组成的 URL query 字符串 |

## 常用字段

| 字段 | 说明 |
| --- | --- |
| `appid` | 小程序 appId |
| `device_brand` | 设备品牌 |
| `device_model` | 设备型号 |
| `device_id` | 设备 ID |
| `platform` | 平台类型 |
| `system` | 系统版本 |
| `sdk_version` | 基础库版本 |
| `screen_width` | 屏幕宽度 |
| `screen_height` | 屏幕高度 |
