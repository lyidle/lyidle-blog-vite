<template>
  <animations-scrollTop></animations-scrollTop>
  <context-menu>
    <layout-theme></layout-theme>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </context-menu>
</template>

<script setup lang="ts" name="App">
// 引入仓库
import { useUserStore } from "@/store/user"
// 引入utils 设置网页标签信息 离开和回来
import { setTitleTip } from "@/utils/effect"
// 引入 全局的事件 变更
import { useGlobalEmitter } from "./globalEmitter"

// 全局的 监听事件 使用 mitt 管理
useGlobalEmitter()

// 提取数据
const { reqUserMenuList } = useUserStore()

// 发起请求
onBeforeMount(async () => {
  await reqUserMenuList()
})

onMounted(() => {
  // 初始化标题
  setTitleTip()
})
</script>

<style scoped lang="scss"></style>
