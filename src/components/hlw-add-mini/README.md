# hlw-add-mini 添加小程序提示气泡组件

用于在页面顶部高亮显示提示气泡，指引并提示用户点击右上角将当前小程序“添加到我的小程序”中，以提升小程序的用户留存与二次回访率。

---

## 特性

* **智能避让与精准指向**：利用小程序 `getMenuButtonBoundingClientRect` 胶囊元数据，气泡箭头将**像素级精准指向**右上角胶囊的“···”三点按钮中心。
* **零配置自适应导航栏**：组件内部自动探测宿主页面的 `navigationStyle`（包括全局配置与页面单体配置）。若检测为全局/页面**自定义导航栏（`custom`）**，组件会自动避让胶囊按钮并下移气泡；若为默认原生导航栏，则自动贴顶展示，完全无需开发者手动传入导航栏参数。
* **跨端优雅容错**：在不支持胶囊数据探测的非微信小程序平台，自动执行安全像素高度与宽度的优雅降级。

---

## 属性说明 (Props)

| 属性名 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| `show` | 控制气泡的显示与隐藏 | `Boolean` | `false` |
| `title` | 提示气泡的主标题文字 | `String` | `"添加到我的小程序"` |
| `desc` | 提示气泡的副标题/描述文字（传入空字符将不渲染描述行） | `String` | `"点击右上角 ··· 添加"` |

---

## 事件说明 (Events)

| 事件名 | 说明 | 参数 |
| :--- | :--- | :--- |
| `@close` | 用户点击气泡右侧“×”关闭按钮时触发，开发者应在此事件中修改 `show` 为 `false` | 无 |

---

## 使用示例

```vue
<template>
    <view class="container">
        <!-- 指引添加小程序气泡 -->
        <hlw-add-mini 
            :show="showAddMiniTip" 
            @close="showAddMiniTip = false" 
        />
        
        <view class="content">
            页面其它主体内容...
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showAddMiniTip = ref(false);

onMounted(() => {
    // 首次进入页面时展示，或根据用户本地缓存判断是否展示
    const hasAdded = uni.getStorageSync("has_added_mini");
    if (!hasAdded) {
        showAddMiniTip.value = true;
    }
});
</script>
```
