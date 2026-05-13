# refs 调用文档

`useRefs` 用于 `v-for` 场景批量收集组件或元素引用。

## 引入

```ts
import { useRefs } from "@hlw-uni/mp-vue";
```

## 基础用法

```vue
<template>
    <hlw-popup
        v-for="item in list"
        :key="item.id"
        :ref="setRefs(item.id)"
    />
</template>

<script setup lang="ts">
import { useRefs } from "@hlw-uni/mp-vue";

const { refs, setRefs } = useRefs();

function open(id: string) {
    refs.value[id]?.open?.();
}
</script>
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `refs` | `Record<string, any>` 的响应式引用集合 |
| `setRefs(key)` | 返回可绑定到模板 `ref` 的回调函数 |

组件更新前和卸载时，内部会自动清空引用集合，避免旧引用残留。
