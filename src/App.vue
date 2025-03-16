<template>
  <!-- element-plus的配置 -->
  <el-config-provider :locale="zhCn">
    <!-- 右键菜单 -->
    <my-context-menu />
    <!-- 全局面板 -->
    <global-theme></global-theme>
    <!-- 路由 -->
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
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
