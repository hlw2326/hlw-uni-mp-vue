# share 调用文档

`useShare` 注册微信小程序分享给好友和分享到朋友圈，并尝试打开分享菜单。

## 引入

```ts
import { useShare } from "@hlw-uni/mp-vue";
```

## 基础用法

```ts
useShare({
    title: "好用的小程序",
    path: "/pages/index/index?from=share",
    imageUrl: "https://example.com/share.png",
});
```

## 动态分享内容

```ts
const share = useShare(() => ({
    title: detail.value.title,
    path: `/pages/detail/index?id=${detail.value.id}`,
    imageUrl: detail.value.cover,
}));

share.onShareAppMessage({
    title: "覆盖好友分享标题",
});
```

## API

| 方法 | 说明 |
| --- | --- |
| `onShareAppMessage(config?)` | 注册好友分享 |
| `onShareTimeline(config?)` | 注册朋友圈分享 |
| `showShareMenu()` | 主动显示分享菜单 |

同一个 `useShare` 实例中，好友分享和朋友圈分享各只注册一次。

## ShareConfig

```ts
interface ShareConfig {
    title?: string;
    path?: string;
    imageUrl?: string;
}
```
