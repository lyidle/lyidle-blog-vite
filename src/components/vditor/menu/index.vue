<template>
  <div ref="menuCom">
    <vditor-menu-generate :menuData v-if="menuData"></vditor-menu-generate>
  </div>
</template>

<script setup lang="ts" name="DocMenuTree">
// 引入 类型
import { TocNode } from "@/views/doc/review/types"
// 引入 侧边栏固定的 hook
import { useSideMenuFixed } from "@/hooks/Doc/sideMenuFixed"

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

// 侧边栏吸附效果
.aside-menu-sticky-right {
  position: fixed !important;
  top: calc(var(--header-height) + var(--content-gap));
  z-index: $doc-aside-menu-sticky-right-index;
  right: var(--content-gap);
  width: calc(var(--aside-width) - 0.1875rem);
}
// 侧边栏吸附效果 左侧
.aside-menu-sticky-left {
  position: fixed !important;
  top: calc(var(--header-height) + var(--content-gap));
  z-index: $doc-aside-menu-sticky-right-index;
  left: var(--content-gap);
  width: calc(var(--aside-width) - 0.1875rem);
}
</style>
