# navigator 调用文档

`useNavigate` 统一封装 uni-app 页面跳转、tab 跳转、返回和打开其他小程序。

## 引入

```ts
import { useNavigate } from "@hlw-uni/mp-vue";
```

## 基础用法

```ts
const nav = useNavigate();

nav.to("/pages/detail/index?id=1");
nav.redirect("/pages/login/index");
nav.tab("/pages/index/index");
nav.reLaunch("/pages/index/index");
nav.back();
```

## 打开其他小程序

```ts
nav.miniProgram("wx1234567890", {
    path: "pages/index/index?id=1",
    envVersion: "release",
    extraData: {
        from: "hlw",
    },
});
```

## 通用跳转

```ts
nav.navigate("navigateTo", "/pages/detail/index?id=1", {
    silent: true,
    onFail: (message) => {
        console.log(message);
    },
});
```

## API

| 方法 | 说明 |
| --- | --- |
| `navigate(type, url, options?)` | 通用跳转入口 |
| `to(url, options?)` | `uni.navigateTo` |
| `redirect(url, options?)` | `uni.redirectTo` |
| `tab(url, options?)` | `uni.switchTab` |
| `reLaunch(url, options?)` | `uni.reLaunch` |
| `back(delta?, options?)` | `uni.navigateBack` |
| `miniProgram(appId, options?)` | `uni.navigateToMiniProgram` |

## NavigateOptions

```ts
interface NavigateOptions {
    silent?: boolean;
    onFail?: (message: string) => void;
    delta?: number;
    path?: string;
    envVersion?: "develop" | "trial" | "release";
    extraData?: Record<string, unknown>;
}
```

`webview` 类型当前只提示 `H5：{url}`，具体 web-view 承载页由业务项目实现。
