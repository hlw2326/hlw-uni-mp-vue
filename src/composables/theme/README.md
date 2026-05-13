# theme 调用文档

`theme` 模块提供字体档位、主题色、外观模式、排版 token 和 `page-meta` 样式注入能力。

## 引入

```ts
import {
    useThemePageStyle,
    getCurrentFontScale,
    getCurrentFontVars,
    getCurrentThemeColor,
    getCurrentThemeVars,
    getCurrentAppearance,
    getCurrentAppearanceMode,
    getCurrentAppearanceVars,
    getCurrentTypographyVars,
} from "@hlw-uni/mp-vue";
```

## useThemePageStyle

页面需要把主题 CSS 变量注入到小程序 page 根时使用。

```vue
<template>
    <page-meta :page-style="themePageStyle" />
    <hlw-page>
        页面内容
    </hlw-page>
</template>

<script setup lang="ts">
import { useThemePageStyle } from "@hlw-uni/mp-vue";

const { themePageStyle } = useThemePageStyle();
</script>
```

如果项目启用了 `@hlw-uni/mp-vite-plugin` 的 `themePageMeta`，页面可由插件自动注入 `<page-meta>` 和 `useThemePageStyle`。

## 字体档位

```ts
const scale = getCurrentFontScale();
const vars = getCurrentFontVars();

console.log(scale, vars["--font-base"]);
```

支持的 `FontScale`：

| 值 | 说明 |
| --- | --- |
| `small` | 较小 |
| `compact` | 略小 |
| `normal` | 标准 |
| `medium` | 适中 |
| `large` | 较大 |
| `xlarge` | 超大 |
| `xxlarge` | 特大 |

## 主题色

```ts
const color = getCurrentThemeColor();
const vars = getCurrentThemeVars();

console.log(color, vars["--primary-color"]);
```

常用导出：

| 导出 | 说明 |
| --- | --- |
| `THEME_COLOR_KEY` | 主题色 storage key |
| `THEME_SEMANTIC_COLORS` | 语义色 |
| `DEFAULT_THEMES` | 内置主题色列表 |
| `getCurrentThemeColor()` | 读取当前主题色 |
| `getCurrentThemeVars()` | 生成主题色 CSS 变量 |

## 外观模式

```ts
const appearance = getCurrentAppearance();
const mode = getCurrentAppearanceMode();
const vars = getCurrentAppearanceVars();

console.log(appearance, mode, vars["--bg-page"]);
```

`Appearance` 支持：

| 值 | 说明 |
| --- | --- |
| `light` | 浅色模式 |
| `dark` | 深色模式 |
| `auto` | 跟随系统 |

## 排版 token

```ts
const vars = getCurrentTypographyVars();

console.log(vars["--text-title-size"]);
```

内置语义角色：

| 角色 | 用途 |
| --- | --- |
| `title-lg` | 页面大标题 |
| `title` | 卡片或分区主标题 |
| `subtitle` | 次级标题 |
| `body` | 正文 |
| `desc` | 描述文字 |
| `caption` | 角标、时间戳等小字 |

## 切换主题

主题状态由 `useThemeStore` 管理，store 会写入 storage，`useThemePageStyle` 会响应 `scale` 和 `primaryColor` 变化。

```ts
import { useThemeStore } from "@hlw-uni/mp-vue";

const theme = useThemeStore();

theme.setScale("large");
theme.setTheme("#3b82f6");
theme.setAppearance("auto");
```
