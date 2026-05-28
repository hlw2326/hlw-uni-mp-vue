# ad 调用文档

提供微信小程序插屏广告和激励视频广告的配置与播放能力。

## 引入

```ts
import { setAdPopup, showAdPopup, setAdReward, showAdReward } from "@hlw-uni/mp-vue";
```

## 插屏广告

```ts
setAdPopup("adunit-popup-id", (ok) => {
    console.log("插屏广告关闭", ok);
});

await showAdPopup(1000);
```

## 激励视频

```ts
setAdReward("adunit-reward-id", (res) => {
    if (res.ok) {
        // 用户完整看完激励视频
    }
});

const result = await showAdReward();

if (result.ok) {
    // 发放奖励
}
```

## API

| 方法 | 说明 |
| --- | --- |
| `setAdPopup(adId, done?)` | 创建插屏广告实例 |
| `showAdPopup(delay?)` | 延迟展示插屏广告，默认 3000ms |
| `setAdReward(adId, done?)` | 创建激励视频实例 |
| `showAdReward()` | 展示激励视频，失败时会尝试 load 后再 show |

## 类型

```ts
interface AdRes {
    ok: boolean;
    isEnded?: boolean;
    err?: unknown;
}
```
