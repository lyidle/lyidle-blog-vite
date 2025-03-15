<template>
  <el-config-provider :locale="zhCn">
    <my-context-menu>
      <global-theme></global-theme>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </my-context-menu>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
// 引入 全局的事件 变更
import { useGlobalEmitter } from "@/hooks/globalEmitter"
// 中文化
import zhCn from "element-plus/es/locale/lang/zh-cn"

// 全局的 监听事件 使用 mitt 管理 和 效果等
useGlobalEmitter()
</script>
<!-- el-select -->
<style>
/* jumper 的select */
.el-select {
  /* 字体颜色 */
  --el-text-color-regular: var(--pagination-color);
  --el-text-color-placeholder: var(--pagination-color);
  /* 填充颜色 */
  --el-fill-color-blank: var(--pagination-bg);
  --el-border-color: var(--pagination-bg);
  --el-color-primary: var(--pagination-bg);
  --el-border-color-hover: var(--pagination-bg);
}

/* popover的背景 */

/* 背景 */
.el-popper.is-light,
.el-popper.is-light > .el-popper__arrow:before {
  --el-bg-color-overlay: var(--popconfirm-bg);
  --el-border-color-light: var(--popconfirm-bg);
}
/* 悬浮背景 */
.el-select-dropdown__item.is-hovering {
  --el-fill-color-light: var(--pagination-bg-active);
}
/* 激活状态 */
.el-select-dropdown__item.is-selected {
  --el-color-primary: var(--pagination-color-hover);
  font-weight: normal;
}
</style>
