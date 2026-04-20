# @hlw-uni/mp-vue

> hlw-uni Vue 组件库 — 供 uni-app 小程序业务方使用的 UI 组件集合

基于 Vue 3 + TypeScript 构建，面向 uni-app 多端小程序（微信、抖音等）场景，由 uni-app 编译器适配各平台原生组件。

## 特性

- 基于 Vue 3 Composition API + `<script setup>`
- 完整的 TypeScript 类型定义
- 多端兼容（微信小程序 / 抖音小程序等）
- Tree-shaking 友好，按需引入
- 轻量、零样式侵入

## 安装

```bash
npm install @hlw-uni/mp-vue
# 或
pnpm add @hlw-uni/mp-vue
```

### Peer Dependencies

- `vue >= 3.4.0`

### 依赖

- `@hlw-uni/mp-core` — 共享核心工具

## 使用

```ts
import { HlwAd, HlwAvatar, HlwEmpty, HlwLoading, HlwMenuList } from '@hlw-uni/mp-vue';
import type { MenuItem, HlwPagingRef } from '@hlw-uni/mp-vue';
```

可在页面或组件中直接注册并使用：

```vue
<script setup lang="ts">
import { HlwEmpty, HlwLoading } from '@hlw-uni/mp-vue';
</script>

<template>
  <HlwLoading text="加载中..." />
  <HlwEmpty text="暂无数据" />
</template>
```

## 主题能力

`mp-vue` 内置了基础主题能力，`useThemePageStyle()` 会返回一组可直接挂到页面根节点上的 CSS 变量样式。

当前内置变量主要包括：

- 主题色：`--primary-color`、`--primary-light`、`--primary-dark`
- 字体档位：`--font-xs`、`--font-sm`、`--font-base`、`--font-md`、`--font-lg`、`--font-xl`

### 基础用法

```vue
<script setup lang="ts">
import { useThemePageStyle } from "@hlw-uni/mp-vue";

const { themePageStyle } = useThemePageStyle();
</script>

<template>
  <hlw-page :style="themePageStyle" title="首页">
    <view class="demo-card">主题演示</view>
  </hlw-page>
</template>

<style scoped lang="scss">
.demo-card {
  color: var(--primary-color);
  background: var(--primary-light);
  font-size: var(--font-base);
}
</style>
```

### 叠加项目自定义主题变量

如果业务项目还需要自己的主题参数，推荐在 `themePageStyle` 的基础上继续追加，而不是直接修改组件库源码。

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
    `--header-gradient: linear-gradient(135deg, ${themeStore.primaryColor}, #0f172a)`,
    `--brand-text-color: #0f172a`,
  ].join(";");
});
</script>

<template>
  <hlw-page :style="pageStyle" title="首页">
    <view class="hero">项目自定义主题</view>
  </hlw-page>
</template>

<style scoped lang="scss">
.hero {
  background: var(--header-gradient);
  box-shadow: var(--card-shadow);
  color: var(--brand-text-color);
}
</style>
```

### 推荐做法

当项目里有较多业务主题变量时，建议再封装一层自己的组合式函数，例如 `useAppThemeStyle()`，统一输出：

- `mp-vue` 基础变量
- 项目自定义变量
- 页面级视觉变量

这样可以保持组件库主题和业务主题解耦，后续升级 `mp-vue` 时也更稳定。

## 组件

### HlwAd — 广告组件

对小程序原生 `<ad>` 的封装，支持信息流 / Banner 广告。

**Props**

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `unitId` | `string` | 是 | 广告单元 ID（在各平台广告后台申请） |

**Events**

| 事件 | 说明 |
| --- | --- |
| `load` | 广告加载成功 |
| `close` | 用户关闭广告 |
| `error` | 加载/展示失败，携带 `{ errCode, errMsg }` |

```vue
<HlwAd unit-id="adunit-xxx" @load="onLoad" @error="onError" />
```

---

### HlwAvatar — 头像

支持图片头像，加载失败或未传 `src` 时降级显示首字母占位。

**Props**

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | — | 头像图片地址 |
| `name` | `string` | — | 用户名（首字母占位） |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |

```vue
<HlwAvatar :src="user.avatar" :name="user.name" size="large" />
```

---

### HlwEmpty — 空状态

**Props**

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | `'暂无数据'` | 提示文案 |
| `image` | `string` | — | 自定义占位图，未传时显示默认图标 |

**Slots**

- `default` — 自定义底部内容（如操作按钮）

```vue
<HlwEmpty text="还没有任何记录">
  <button @click="refresh">刷新</button>
</HlwEmpty>
```

---

### HlwLoading — 加载中

**Props**

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 加载文案，可选 |

```vue
<HlwLoading text="加载中..." />
```

---

### HlwMenuList — 菜单列表

常用于"我的"页面的设置菜单。

**Props**

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | 是 | 菜单项数组 |

**MenuItem 类型**

```ts
interface MenuItem {
  key: string;            // 唯一标识
  label: string;          // 显示文案
  icon?: string;          // 图标（emoji 或字体）
  value?: string;         // 右侧附加信息
  url?: string;           // 点击跳转的页面路径
  action?: () => void;    // 点击执行的函数
}
```

**Events**

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `item: MenuItem` | 点击菜单项时触发 |

```vue
<script setup lang="ts">
import { HlwMenuList, type MenuItem } from '@hlw-uni/mp-vue';

const items: MenuItem[] = [
  { key: 'profile', label: '个人资料', icon: '👤', url: '/pages/profile/index' },
  { key: 'settings', label: '设置', icon: '⚙️', value: '已开启' },
  { key: 'logout', label: '退出登录', icon: '🚪', action: () => uni.showToast({ title: '已退出' }) },
];
</script>

<template>
  <HlwMenuList :items="items" @click="onMenuClick" />
</template>
```

## 开发

```bash
# 构建
npm run build

# 监听构建（开发模式）
npm run dev
```

构建产物输出到 `dist/`：

- `dist/index.mjs` — ES Module
- `dist/index.js` — CommonJS
- `dist/index.d.ts` — TypeScript 类型定义

## 项目结构

```
mp-vue/
├── src/
│   ├── components/
│   │   ├── hlw-ad/
│   │   ├── hlw-avatar/
│   │   ├── hlw-empty/
│   │   ├── hlw-loading/
│   │   └── hlw-menu-list/
│   └── index.ts          # 统一导出入口
├── dist/                 # 构建产物
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## HlwPaging

基于 `z-paging` 的包装组件。保留 `z-paging` 原始 props、事件和大部分插槽，同时默认接入 `hlw-loading` 和 `hlw-empty` 作为加载态与空态展示。

**额外 Props**

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `loadingText` | `string` | `'加载中...'` | 默认 loading 文案 |
| `emptyText` | `string` | `'暂无数据'` | 默认空态文案 |
| `errorText` | `string` | `'加载失败，请稍后重试'` | 默认失败文案 |
| `emptyImage` | `string` | `''` | 自定义空态图片 |
| `useDefaultLoading` | `boolean` | `true` | 是否启用默认 loading 插槽 |
| `useDefaultEmpty` | `boolean` | `true` | 是否启用默认 empty 插槽 |

**插槽**

- 继续支持 `z-paging` 的原始插槽，如 `loading`、`empty`、`refresher`、`top`、`bottom`
- 额外支持 `empty-extra`，用于在默认空态下方插入自定义内容

**Ref 类型**

```ts
import type { HlwPagingRef } from '@hlw-uni/mp-vue';
```

**基础示例**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { HlwPagingRef } from '@hlw-uni/mp-vue';

interface ListItem {
  id: number;
  title: string;
}

const paging = ref<HlwPagingRef<ListItem> | null>(null);
const dataList = ref<ListItem[]>([]);

const queryList = async (pageNo: number, pageSize: number) => {
  const list = Array.from({ length: pageSize }, (_, index) => ({
    id: (pageNo - 1) * pageSize + index + 1,
    title: `第 ${pageNo} 页数据 ${index + 1}`,
  }));

  paging.value?.completeByNoMore(list, pageNo >= 3);
};
</script>

<template>
  <hlw-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    loading-text="正在同步数据"
    empty-text="还没有任何记录"
  >
    <view v-for="item in dataList" :key="item.id" class="demo-row">
      {{ item.title }}
    </view>
  </hlw-paging>
</template>
```

**自定义空态**

```vue
<hlw-paging v-model="dataList" @query="queryList" :use-default-empty="false">
  <template #empty="{ isLoadFailed }">
    <hlw-empty :text="isLoadFailed ? '请求失败，请重试' : '这里暂时还是空的'" />
  </template>
</hlw-paging>
```

**常用 Ref 方法**

- `reload(animate?)`
- `refresh()`
- `complete(list)`
- `completeByTotal(list, total)`
- `completeByNoMore(list, noMore)`
- `completeByError(cause)`
- `clear()`
- `scrollToTop()`

更多分页能力和原始参数可参考 `z-paging` 文档：https://z-paging.zxlee.cn

## License

内部组件库，仅供 hlw-uni 项目使用。
