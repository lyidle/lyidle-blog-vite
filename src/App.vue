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
