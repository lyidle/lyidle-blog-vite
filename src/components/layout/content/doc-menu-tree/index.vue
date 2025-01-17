<template>
  <div ref="menuCom">
    <GenerateMenuTree :menuData v-if="menuData"></GenerateMenuTree>
  </div>
</template>

<script setup lang="ts" name="DocMenuTree">
// 引入 类型
import { TocNode } from "@/views/doc/types"
// 引入 侧边栏固定的 hook
import { useSideMenuFixed } from "@/hooks/sideMenuFixed"
// 引入子组件 用来递归 时 不用自身的组件递归
import GenerateMenuTree from "./generate.vue"
const props = defineProps<{
  menuData?: TocNode[]
  observerMenu: HTMLDivElement | undefined
}>()
const menuCom = ref<HTMLDivElement | undefined>()
useSideMenuFixed(props.menuData, props.observerMenu, menuCom)
</script>
