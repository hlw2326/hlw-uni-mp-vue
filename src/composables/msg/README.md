# msg 调用文档

`useMsg` 统一封装 toast、loading、modal 和简单进度展示。

## 引入

```ts
import { useMsg } from "@hlw-uni/mp-vue";
```

## 基础用法

```ts
const msg = useMsg();

msg.toast("保存中");
msg.success("保存成功");
msg.error("保存失败");

msg.showLoading("加载中...");
msg.hideLoading();
```

## 确认弹窗

```ts
const ok = await msg.confirm({
    title: "删除确认",
    content: "确定删除这条记录吗？",
    confirmText: "删除",
});

if (ok) {
    // 用户点击确认
}
```

`modal` 是 `confirm` 的语义别名。

## API

| 方法 | 说明 |
| --- | --- |
| `toast(opts | string)` | 普通提示 |
| `success(message)` | 成功提示 |
| `error(message)` | 失败提示 |
| `fail(message)` | `error` 的别名 |
| `showLoading(message?)` | 显示全局 loading |
| `hideLoading()` | 关闭全局 loading |
| `confirm(opts)` | 确认弹窗，返回 `Promise<boolean>` |
| `modal(opts)` | `confirm` 的别名 |
| `setLoadingBar(progress)` | 用导航标题模拟进度 |

## ToastOptions

```ts
interface ToastOptions {
    message: string;
    icon?: "success" | "fail" | "exception" | "none";
    image?: string;
    duration?: number;
    mask?: boolean;
    position?: "top" | "center" | "bottom";
}
```

## ModalOptions

```ts
interface ModalOptions {
    title?: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    cancelColor?: string;
    showCancel?: boolean;
}
```
