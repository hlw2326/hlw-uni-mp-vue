# utils 调用文档

`useUtils` 提供剪贴板、下载、保存相册、query 拼接和基础类型转换工具。

## 引入

```ts
import { useUtils } from "@hlw-uni/mp-vue";
```

## 基础用法

```ts
const utils = useUtils();

await utils.copy("要复制的文本");
const text = await utils.paste();

const qs = utils.toQuery({ id: 1, keyword: "测试" });
const url = utils.withQuery("/pages/search/index", qs);

const age = utils.toNumber("18", 0);
const enabled = utils.toBoolean("1", false);
```

## 下载和保存

```ts
const res = await utils.download({
    url: "https://example.com/a.png",
    progress: (value, done, total) => {
        console.log(value, done, total);
    },
});

if (res.ok && res.path) {
    await utils.saveImage(res.path);
}

await utils.saveImageUrl("https://example.com/a.png");
await utils.saveVideoUrl("https://example.com/a.mp4");
```

## API

| 方法 | 说明 |
| --- | --- |
| `withQuery(url, qs)` | 为 URL 追加 query |
| `toQuery(data)` | 对象转 URL query |
| `signText(url)` | 生成签名原文，query 会排序 |
| `toNumber(value, defaultValue)` | 安全转数字 |
| `toBoolean(value, defaultValue)` | 安全转布尔 |
| `copy(text, tip?)` | 复制文本 |
| `paste()` | 读取剪贴板 |
| `saveImage(path)` | 保存本地图片到相册 |
| `saveVideo(path)` | 保存本地视频到相册 |
| `download(options)` | 下载文件 |
| `saveImageUrl(url, progress?)` | 下载远程图片并保存 |
| `saveVideoUrl(url, progress?)` | 下载远程视频并保存 |

## DownloadOpt

```ts
interface DownloadOpt {
    url: string;
    path?: string;
    header?: Record<string, string>;
    progress?: (value: number, done: number, total: number) => void;
}
```

## DownloadRes

```ts
interface DownloadRes {
    ok: boolean;
    path?: string;
    code?: number;
    msg?: string;
}
```
