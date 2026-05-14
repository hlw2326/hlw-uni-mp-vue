# 添加到我的小程序提示

轻量提示用户从右上角菜单添加小程序。

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| show | 是否显示 | Boolean | false |
| navigationStyle | 顶部导航栏样式，可选 `default`、`custom` | String | default |
| title | 标题 | String | 添加到我的小程序 |
| desc | 描述 | String | 点击右上角 ··· 添加 |

```vue
<template>
	<hlw-add-mini :show="show" @close="close" />
</template>
```
