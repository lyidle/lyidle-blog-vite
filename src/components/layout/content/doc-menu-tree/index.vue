<template>
  <div ref="menuCom">
    <GenerateMenuTree :menuData v-if="menuData"></GenerateMenuTree>
  </div>
</template>

<script setup lang="ts" name="DocMenuTree">
// 引入 类型
import { TocNode } from "@/views/doc/review/types"
// 引入 侧边栏固定的 hook
import { useSideMenuFixed } from "@/hooks/Doc/sideMenuFixed"
// 引入子组件 用来递归 时 不用自身的组件递归
import GenerateMenuTree from "./generate.vue"

// 接收props
const props = defineProps<{
  menuData?: TocNode[]
  observerMenu: HTMLDivElement | undefined
}>()

if (props.menuData?.[0]) props.menuData[0].active = true

// 获取菜单 实列
const menuCom = ref<HTMLDivElement | undefined>()

// 固定侧边栏
useSideMenuFixed(props.menuData, props.observerMenu, menuCom)
</script>
<style lang="scss">
.active {
  color: var(--doc-menu-highlight);
}
</style>
