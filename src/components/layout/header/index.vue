<template>
  <div class="global-header" ref="header">
    <div class="logo">
      <router-link to="/">{{ LOGO }}</router-link>
    </div>
    <layout-topnav :menuList="userMenuList"></layout-topnav>
    <layout-topnav-mini></layout-topnav-mini>
  </div>
</template>

<script setup lang="ts" name="LayoutHeader">
// 引入store
import { useUserStore } from "@/store/user"
import { observer, ObserverCallback } from "@/utils/observer"

const { userMenuList } = storeToRefs(useUserStore())

const LOGO = import.meta.env.VITE_INITIAL_LOGO

// 导航的颜色
// 头部字体颜色
const headerColor = ref<string>("white")
// 头部背景颜色
const headerBg = ref<string>("transparent")
// 导航吸附 配置项
const options: ObserverCallback = {
  enter: () => {
    headerBg.value = "var(--header-bg-initial)"
    headerColor.value = "var(--header-color-initial)"
  },
  leave: () => {
    headerBg.value = "var(--header-bg-sticky)"
    headerColor.value = "var(--header-color-sticky)"
  },
}

onMounted(() => {
  const el = document.querySelector(".banner-observer")
  el && observer(el, options)
})
onUnmounted(() => {
  options.stop?.()
})
</script>

<style scoped lang="scss">
// 引入头部变量
.global-header {
  color: v-bind(headerColor);
  width: 100%;
  height: var(--header-height);
  @include flex(space-between);
  padding: 0 var(--header-pd);
  background-color: v-bind(headerBg);
  position: fixed;
  box-sizing: border-box;
  top: 0;
  z-index: $global-header-index;
  transition: background-color var(--header-bg-initial-during),
    padding var(--header-bg-initial-during);
  .logo {
    font-family: "LOGO";
  }
  // 设置menu的阴影
  ::v-deep(.custom-menu),
  ::v-deep(.custom-popover) {
    filter: drop-shadow(var(--header-menu-drop-shadow));
  }
}
</style>
