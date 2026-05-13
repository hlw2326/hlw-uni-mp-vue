# request 调用文档

`request` 模块封装 `uni.request`、请求拦截器、响应拦截器、错误拦截器、上传和服务类组织方式。

## 引入

```ts
import {
    useRequest,
    useUpload,
    BaseService,
    ServiceNamespace,
    ServicePrefix,
} from "@hlw-uni/mp-vue";
```

## useRequest

```ts
const request = useRequest();

request.setBaseURL("https://api.example.com");

const offRequest = request.onRequest((config) => {
    config.headers = {
        ...config.headers,
        "x-token": uni.getStorageSync("token"),
    };
    return config;
});

const res = await request.get<{ name: string }>("/user/profile");

offRequest();
```

## API

| 方法 | 说明 |
| --- | --- |
| `request(config)` | 发起完整配置请求 |
| `get(url, data?)` | GET 请求 |
| `post(url, data?)` | POST 请求 |
| `put(url, data?)` | PUT 请求 |
| `del(url, data?)` | DELETE 请求 |
| `setBaseURL(url)` | 设置全局基础地址 |
| `onRequest(fn)` | 注册请求拦截器，返回取消函数 |
| `onResponse(fn)` | 注册响应拦截器，返回取消函数 |
| `onError(fn)` | 注册错误拦截器，返回取消函数 |
| `upload(config)` | 上传文件 |
| `resolveServiceUrl(namespace, url, servicePrefix?)` | 生成服务类请求地址 |

## 响应格式

```ts
interface ApiResponse<T = unknown> {
    code: number;
    data: T;
    info: string;
}
```

## useUpload

```ts
const { uploading, upload } = useUpload();

const result = await upload({
    type: "local",
    server: "https://api.example.com/upload",
    url: "https://api.example.com/upload",
    filePath: tempFilePath,
    header: {
        "x-token": uni.getStorageSync("token"),
    },
});

console.log(uploading.value, result.data);
```

上传类型：

| 类型 | 说明 |
| --- | --- |
| `local` | 直接上传到业务接口 |
| `cos` | 腾讯云 COS 表单上传 |
| `oss` | 阿里云 OSS 表单上传 |
| `qiniu` | 七牛云表单上传 |
| `alist` | Alist 上传 |

## BaseService

```ts
@ServicePrefix("api")
@ServiceNamespace("user")
class UserService extends BaseService {
    profile() {
        return this.get<{ nickname: string }>("/profile");
    }

    update(data: { nickname: string }) {
        return this.post("/update", data);
    }
}

const userService = new UserService();
const profile = await userService.profile();
```

上面的 `profile()` 会请求 `/api/user/profile`。如果传入绝对地址，例如 `https://example.com/a`，则不会拼接前缀。

## UploadConfig

```ts
interface UploadConfig {
    server: string;
    filePath: string;
    fileName?: string;
    type: string;
    credentials?: Record<string, string>;
    header?: Record<string, string>;
    url?: string;
}
```
