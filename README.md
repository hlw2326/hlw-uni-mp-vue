# @hlw-uni/mp-vue

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.59-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/vue-3.x-emerald.svg" alt="Vue 3">
  <img src="https://img.shields.io/badge/typescript-supported-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/platform-uni--app-red.svg" alt="uni-app">
</p>

> **hlw-uni 小程序运行时核心组件与工具包**  
> 聚合了 Vue 3 UI 组件库、高精简主题控制、网络请求封装、常用 Composables 工具集。从 `2.0` 起，已全面合并原 `@hlw-uni/mp-core` 的全部能力，实现业务方一处 import，全场景覆盖。

---

## 🚀 特性

- 💪 **现代化架构** — 基于 Vue 3 Composition API + `<script setup>` 构建。
- 📐 **完整类型系统** — 100% 采用 TypeScript 编写，提供极佳的类型推导与开发体验。
- 📱 **多端小程序适配** — 面向 uni-app 多端场景（微信、抖音、支付宝等），完美兼容宿主原生组件。
- 🎨 **弹性主题能力** — 极简而强大的 CSS 变量主题方案，支持页面级和应用级自由注入与重叠扩展。
- 🧩 **按需引入 & 零体积负担** — 支持 uni-app `easycom` 自动按需引入，配合 Tree-shaking，业务产物小而美。
- 🛠️ **一键式开发基建** — 封装了消息、路由、分享、系统设备、请求、高级上传及 BaseService 服务基类，开箱即用。

---

## 📦 安装与配置

### 1. 安装组件库

```bash
pnpm add @hlw-uni/mp-vue
# 或者使用 npm / yarn
npm install @hlw-uni/mp-vue
```

> [!NOTE]
> **Peer Dependencies**
> - `vue >= 3.4.0`
> - `pinia >= 2.0.0` (如需使用全局 App 上下文及状态)

### 2. easycom 组件自动注册

在业务项目的 `pages.json` 中配置 `easycom`，即可在页面中直接使用 `hlw-` 开头的全部 UI 组件，**无需手动 `import` 和注册**：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^hlw-(.*)": "@hlw-uni/mp-vue/src/components/hlw-$1/index.vue"
    }
  },
  "pages": [
    // ...
  ]
}
```

---

## 🛠️ 全局应用入口 & `hlw` 命名空间

### 1. 引导初始化 `useApp()`

在小程序的 `main.ts` 或 `main.js` 中收敛并初始化 Vue 实例：

```ts
import { useApp } from '@hlw-uni/mp-vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = useApp();

// 注册插件
app.use(createPinia());

// 生成符合 uni-app 约定的 createApp 入口
export const createApp = app.install(App);
```

### 2. 全局命名空间单例 `hlw`

`hlw` 命名空间聚合了框架最核心的工具服务，您可以通过全局或导入的形式方便地访问它们：

```ts
import { hlw } from '@hlw-uni/mp-vue';

// 1. $msg 消息通知
hlw.$msg.toast("操作成功");

// 2. $device 系统设备信息
console.log(hlw.$device.brand, hlw.$device.platform);

// 3. $request HTTP 客户端
const res = await hlw.$request.get("/config");

// 4. $utils 公共工具箱
hlw.$utils.copy("复制的文本");
```

---

## 🎨 样式与主题能力

`mp-vue` 内置了基础主题驱动。推荐使用 `useThemePageStyle()` 组合式 API，它会返回一组挂载在页面根节点上的标准化 CSS 变量样式。

### 1. 基础用法

```vue
<script setup lang="ts">
import { useThemePageStyle } from "@hlw-uni/mp-vue";

const { themePageStyle } = useThemePageStyle();
</script>

<template>
  <!-- 将主题变量样式挂载在最外层容器 -->
  <hlw-page :style="themePageStyle" title="主题演示">
    <view class="demo-card">体验主题色</view>
  </hlw-page>
</template>

<style scoped lang="scss">
.demo-card {
  color: var(--primary-color);
  background: var(--primary-light);
  font-size: var(--font-base);
  border-radius: var(--radius-md);
}
</style>
```

### 2. 自由追加 / 覆盖自定义主题变量

不推荐直接修改组件库源码，您可以在返回的变量基础上动态拼接项目或页面级别的专属主题参数：

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useThemePageStyle } from "@hlw-uni/mp-vue";
import { useThemeStore } from "@/store";

const { themePageStyle } = useThemePageStyle();
const themeStore = useThemeStore();

const pageStyle = computed(() => {
  return [
    themePageStyle.value,
    `--page-bg: ${themeStore.primaryColor}10`,
    `--card-shadow: 0 12rpx 40rpx ${themeStore.primaryColor}22`,
    `--brand-text-color: #0f172a`,
  ].join(";");
});
</script>

<template>
  <hlw-page :style="pageStyle" title="自定义主题">
    <view class="custom-card">高度扩展</view>
  </hlw-page>
</template>
```

---

## ⚡ 核心 Composables (工具与服务封装)

### 💬 消息提示 — `useMsg()`

统一且高度简化的 Toast、Loading 与原生模态弹窗。

```ts
import { useMsg } from '@hlw-uni/mp-vue';

const msg = useMsg();

// 1. Toast 轻提示
msg.toast("普通消息提示");
msg.success("保存成功");
msg.error("提交失败");

// 2. Loading 等待框 (带透明防穿透遮罩)
msg.showLoading("数据加载中...");
// 异步操作结束后关闭
msg.hideLoading();

// 3. Promise 风格确认对话框
const confirmDelete = async () => {
  const isOk = await msg.confirm({
    title: "高危操作",
    content: "确定要彻底删除该项目吗？",
    confirmColor: "#ef4444"
  });
  if (isOk) {
    // 执行删除...
  }
};
```

### 🗺️ 路由跳转 — `useNavigate()`

封装了小程序的各类页面跳转，自带安全的异常捕获和提示，支持打开外部小程序。

```ts
import { useNavigate } from '@hlw-uni/mp-vue';

const router = useNavigate();

// 基础路由跳转 (保留当前页)
router.to("/pages/detail/index?id=100");

// 页面重定向 (关闭当前页)
router.redirect("/pages/login/index");

// 切换 TabBar 页面
router.tab("/pages/mine/index");

// 干净重启 (关闭所有页面)
router.reLaunch("/pages/index/index");

// 返回上一页
router.back(); 
// 返回指定层级
router.back(2);

// 跳转到其他小程序
router.miniProgram("wx_appid_xxxxx", {
  path: "pages/home/index",
  envVersion: "release"
});
```

### 📤 微信分享 — `useShare()`

优雅地在 `<script setup>` 中配置小程序卡片和朋友圈分享：

```vue
<script setup lang="ts">
import { useShare } from "@hlw-uni/mp-vue";

// 直接在 setup 阶段声明，将自动接管页面分享按钮及右上角菜单
useShare({
  title: "推荐你体验这个超棒的小程序！",
  path: "/pages/index/index?from=share",
  imageUrl: "https://example.com/share-cover.png"
});
</script>
```

### 🌐 网络请求 — `useRequest()` & `BaseService`

强大的请求库，完美适配拦截器模式与面向服务的 `BaseService` 设计模式。

```ts
import { useRequest, BaseService, ServicePrefix, ServiceNamespace } from "@hlw-uni/mp-vue";

const request = useRequest();

// 1. 配置全局参数
request.setBaseURL("https://api.example.com");

// 2. 注册拦截器
const cancelReq = request.onRequest((config) => {
  config.headers = {
    ...config.headers,
    "Authorization": `Bearer ${uni.getStorageSync("token")}`,
  };
  return config;
});

// 3. 请求接口示例
interface UserProfile {
  nickname: string;
  avatar: string;
}
const profile = await request.get<UserProfile>("/user/profile");

// 4. 面向服务封装 (BaseService)
@ServicePrefix("api")
@ServiceNamespace("member")
class MemberService extends BaseService {
  getProfile() {
    return this.get<UserProfile>("/profile"); // 自动拼接成 /api/member/profile
  }
}

export const memberService = new MemberService();
```

---

## 🧩 核心 UI 组件库说明

`@hlw-uni/mp-vue` 内置了多达 27 个高频易用组件。以下重点介绍核心高频组件的 API 与用法。

### 🏢 1. 页面容器组件 — `hlw-page`

所有页面的根容器，支持自定义页头、自定义页脚、完美控制滚动区域，并通过 `provide` 驱动子组件（如 `hlw-back-top`）。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `""` | 页面标题，设置后渲染默认页头 `hlw-header` |
| `isBack` | `boolean` | `false` | 是否显示返回按钮 |
| `bgClass` | `string` | `""` | 传递给 `hlw-header` 的背景 class |
| `bodyClass` | `string \| object \| array` | `""` | 内层 body 的 class，常用于设置 flex 或 gap 间距 |
| `bodyStyle` | `string \| object` | `""` | 内层 body 的自定义样式 |

#### 示例

```vue
<template>
  <hlw-page title="用户设置" :is-back="true" body-class="p-4 gap-4">
    <!-- 自定义页头 (可选) -->
    <template #header>
      <view class="custom-header">自定义头部</view>
    </template>

    <!-- 页面内容 -->
    <view class="setting-list">
      <view>选项一</view>
    </view>

    <!-- 底部悬浮/固定栏 (不随页面滚动) -->
    <template #footer>
      <view class="footer-bar">
        <hlw-button block>保存修改</hlw-button>
      </view>
    </template>
  </hlw-page>
</template>
```

---

### 🔘 2. 语义化按钮 — `hlw-button`

在原生按钮的基础上进行了大幅功能扩展，支持语义化配色、一键路由跳转、以及极简适配小程序的原生开放能力。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | `ButtonType` | `"primary"` | 按钮类型，可选 `primary \| success \| warning \| danger \| error \| info \| outline \| text \| ghost` |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 按钮尺寸 |
| `loading` | `boolean` | `false` | 是否开启加载状态，开启后按钮禁用并展示 Spinner |
| `disabled` | `boolean` | `false` | 是否禁用按钮 |
| `block` | `boolean` | `false` | 是否独占整行（宽度 100%） |
| `round` | `boolean` | `false` | 是否为高圆角胶囊形态 |
| `icon` | `string` | `""` | 按钮图标类名 |
| `bgColor` | `string` | `""` | 自定义背景颜色（覆盖 type） |
| `textColor` | `string` | `""` | 自定义文字颜色 |
| `url` | `string` | `""` | 快捷页面跳转目标地址 |
| `navigateType` | `NavigateType` | `"navigateTo"` | 路由方式，可选 `navigateTo \| redirectTo \| switchTab \| reLaunch \| navigateBack` |
| `openType` | `string` | `""` | 小程序原生的开放动作类型，如 `share`, `contact`, `getPhoneNumber` 等 |

#### 示例

```vue
<!-- 1. 基础语义按钮 -->
<hlw-button type="success" round>成功按钮</hlw-button>

<!-- 2. 加载态 -->
<hlw-button type="danger" :loading="true">提交中</hlw-button>

<!-- 3. 路由快捷跳转 -->
<hlw-button type="outline" url="/pages/mine/index" navigate-type="switchTab">去我的主页</hlw-button>

<!-- 4. 原生分享触发 -->
<hlw-button type="primary" open-type="share" icon="i-fa6-solid-share">分享给好友</hlw-button>
```

---

### 📋 3. 高级菜单组件 — `hlw-menu`

高度可定制的数据驱动菜单组件，支持列表模式和宫格网格模式。高度适配微信小程序的客服、获取手机号等 `openType` 功能。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `items` | `HlwMenuItem[]` | `[]` | 菜单数据列表 |
| `title` | `string` | `""` | 卡片标题，有值时在菜单上方展示标题及分割线 |
| `mode` | `"list" \| "grid"` | `"list"` | 布局模式，可选列表或宫格模式 |
| `columns` | `number` | `4` | 宫格列数，仅在 `mode="grid"` 时有效 |
| `border` | `boolean` | `true` | 是否展示卡片容器外边框 |

#### `HlwMenuItem` 参数定义

```ts
interface HlwMenuItem {
  icon: string;             // 图标 class
  iconTheme?: string;       // 图标色彩主题：orange, purple, wechat, blue, slate 等
  label: string;            // 菜单标签文案
  url?: string;             // 跳转链接，配置后点击自动跳转，无需绑定 click 事件
  value?: string;           // 右侧纯文本（仅列表模式）
  tag?: string;             // 右侧彩色标签/右上角徽标
  tagTheme?: string;        // 标签颜色：rose, orange, blue, wechat, red
  tagPulse?: boolean;       // 标签是否具有呼吸呼吸灯闪烁动画
  loading?: boolean;        // 是否展示加载状态
  visible?: boolean;        // 是否渲染该子项，控制动态显隐
  openType?: string;        // 小程序原生 open-type 动作
}
```

#### 示例

```vue
<script setup lang="ts">
import type { HlwMenuItem } from "@hlw-uni/mp-vue";

const serviceMenus: HlwMenuItem[] = [
  { icon: "i-fa6-solid-user", label: "个人资料", url: "/pages/profile/index", iconTheme: "blue" },
  { icon: "i-fa6-solid-bell", label: "系统通知", value: "未读 3 条", iconTheme: "orange", tag: "HOT", tagPulse: true },
  { icon: "i-fa6-solid-headset", label: "在线客服", openType: "contact", iconTheme: "wechat" },
  { icon: "i-fa6-solid-gear", label: "设置中心", url: "/pages/setting/index", iconTheme: "slate" },
];
</script>

<template>
  <!-- 列表模式 -->
  <hlw-menu title="我的服务" :items="serviceMenus" />

  <!-- 宫格模式 (4列) -->
  <hlw-menu mode="grid" :columns="4" :items="serviceMenus" class="mt-4" />
</template>
```

---

### 📄 4. 分页滚动包装容器 — `hlw-paging`

基于优秀的 `z-paging` 深度封装，极简整合了主题加载态（`hlw-loading`）和空状态（`hlw-empty`），提供更加一体化和顺滑的无缝滚动加载体验。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `loadingText` | `string` | `"加载中..."` | 加载提示文案 |
| `emptyText` | `string` | `"暂无数据"` | 空状态提示文案 |
| `emptyImage` | `string` | `""` | 自定义空状态图片地址 |
| `useDefaultLoading` | `boolean` | `true` | 是否使用内置的 `hlw-loading` 插槽 |
| `useDefaultEmpty` | `boolean` | `true` | 是否使用内置的 `hlw-empty` 插槽 |

#### 示例

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { HlwPagingRef } from "@hlw-uni/mp-vue";

interface Article {
  id: number;
  title: string;
}

const paging = ref<HlwPagingRef<Article> | null>(null);
const dataList = ref<Article[]>([]);

const onQuery = async (pageNo: number, pageSize: number) => {
  try {
    const res = await fetchArticleList({ page: pageNo, limit: pageSize });
    // 渲染并控制页数判定
    paging.value?.completeByNoMore(res.list, res.list.length < pageSize);
  } catch (err) {
    paging.value?.completeByError(err);
  }
};
</script>

<template>
  <hlw-paging
    ref="paging"
    v-model="dataList"
    loading-text="同步文章列表中"
    empty-text="还没有发表任何文章"
    @query="onQuery"
  >
    <view v-for="item in dataList" :key="item.id" class="article-item p-4 border-b">
      {{ item.title }}
    </view>
  </hlw-paging>
</template>
```

---

## 📂 27个 UI 组件完整索引

为了使开发者了解所有可用的 UI 资产，以下是 `@hlw-uni/mp-vue` 内置的 27 个组件的完整全景列表：

| 组件目录 | 组件名称 | 适用场景及简要说明 |
| :--- | :--- | :--- |
| 🎬 `hlw-ad` | 广告展示 | 对小程序原生 `<ad>` 的封装，支持信息流/Banner广告等 |
| 📲 `hlw-add-mini` | 添加提示 | 引导用户点击小程序右上角“添加到我的小程序”的气泡提示 |
| 👤 `hlw-avatar` | 用户头像 | 支持图片头像，加载失败时自动降级渲染文字首字母占位 |
| 🔝 `hlw-back-top` | 返回顶部 | 自动监听页面滚动并展示悬浮按钮，支持平滑的一键回顶 |
| 🔘 `hlw-button` | 语义化按钮 | 支持多种语义色彩、尺寸档位、路由快捷跳转与原生开放动作 |
| 🎨 `hlw-canvas` | 海报绘制 | 用于快捷生成小程序分享海报的 Canvas 画布包装工具 |
| 📦 `hlw-card` | 卡片容器 | 带有微阴影与圆角的高质感布局容器，常用于聚合业务块 |
| 🏷️ `hlw-card-header` | 卡片头部 | 专门为卡片组件设计的标题栏，支持小装饰线条和动作插槽 |
| 🗂️ `hlw-cell` | 单元格 | 规范的列表项组件，支持图标、标题、副标题与右侧各种扩展插槽 |
| 🧩 `hlw-custom` | 自定义容器 | 统一规范的多用途自定义包装外框 |
| ➖ `hlw-divider` | 分割线 | 带文字或纯线条的排版分割线 |
| 🏜️ `hlw-empty` | 空状态 | 精美质感的空态图标及提示文案，支持挂载自定义引导动作按钮 |
| 🧭 `hlw-header` | 自定义导航栏 | 对小程序原生导航栏的完美替代，支持沉浸式状态栏与返回动作 |
| 🖼️ `hlw-image` | 增强图片 | 支持平滑过渡加载效果、支持懒加载及骨架图占位的 Image 增强版 |
| 🔄 `hlw-loading` | 加载指示器 | 统一风格的加载转圈动效及文案提示 |
| 🍔 `hlw-menu` | 多功能菜单 | 数据驱动，列表模式/宫格模式自由切换，高度适配 `openType` |
| 💬 `hlw-modal` | 模态弹窗 | 轻量的确认与提示弹窗组件 |
| 📢 `hlw-notice-bar` | 滚动通告栏 | 经典的横向滚动滚动条，用于突发通告、重要广播等 |
| 🎁 `hlw-notice-popup` | 通告弹窗 | 页面初始化时弹出的卡片式全局公告、优惠券或活动图 |
| 🏢 `hlw-page` | 页面核心骨架 | 收敛顶部导航栏、底部固定栏与中间高度自适应页面的核心基础件 |
| 📜 `hlw-paging` | 分页滚动组件 | 基于 `z-paging` 深度打通，无缝管理下拉刷新与上拉加载 |
| 🎪 `hlw-popup` | 基础弹窗 | 支持上、下、中等各种方位的轻量级弹窗蒙层容器 |
| 🔍 `hlw-search` | 搜索栏 | 高颜值的小程序搜索输入框，支持一键清空、聚焦回调等 |
| 🗃️ `hlw-sheet` | 动作面板 | 从页面底部升起的动作面板或选项操作菜单 (Action Sheet) |
| 💀 `hlw-skeleton` | 骨架屏 | 高质感微光渐变波纹效果的占位加载骨架屏 |
| 📑 `hlw-tabs` | 横向选项卡 | 自动计算高亮的切换栏，支持文字或含数字徽标的选项 |
| 🔖 `hlw-tag` | 标签 | 多种色彩、填充模式（实心、镂空）的小标签 |

---

## 💻 本地开发与贡献说明

若您需要对 `@hlw-uni/mp-vue` 库进行二次开发、修补或提交贡献，可按如下流程进行：

### 1. 启动监听式构建 (开发模式)

```bash
pnpm dev
# 此时 vite 会监听 src 下所有文件的变动，并自动热重构同步到 dist 目录
```

### 2. 生成生产包

```bash
pnpm build
# 将生成高度优化、体积极致精简的 CommonJS、ESModule 以及 .d.ts 类型声明产物
```

### 3. 构建产物结构

```
mp-vue/
├── dist/
│   ├── index.js          # CommonJS 格式产物
│   ├── index.mjs         # ESModule 格式产物 (供现代打包器 Tree-shaking 使用)
│   └── index.d.ts        # 自动生成的 TS 全量类型声明文件
```

---

## 📄 开源协议

**内部私有组件库**，仅供 `hlw-uni` 项目组内部及关联方协作使用，未经授权请勿分发或公开上传至公共 NPM 镜像。
