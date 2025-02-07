<template>
  <recursive-menulist :MenuList="userMenuList"></recursive-menulist>
</template>

<script setup lang="ts" name="TopNavMiniMenuList">
// 使用子组件
import recursiveMenulist from "./recursive/index.vue"
// 引入 仓库
import { useUserStore } from "@/store/user"
const { userMenuList } = storeToRefs(useUserStore())
</script>

<style scoped lang="scss">
// 第一层的元素 加上圆角 和边距
.menu-list {
  border-radius: 0.625rem;
  overflow: hidden;
  margin: 0.8125rem;
}
</style>
