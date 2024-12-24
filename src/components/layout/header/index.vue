<template>
  <div class="header" ref="header">
    <div class="logo text">
      <router-link to="/">{{ LOGO }}</router-link>
    </div>
    <layout-topnav :menuList="userMenuList"></layout-topnav>
    <layout-topnav-mini></layout-topnav-mini>
  </div>
</template>

<script setup lang="ts" name="LayoutHeader">
// 引入store
import { useUserStore } from "@/store/user"

const { userMenuList } = storeToRefs(useUserStore())

const LOGO = import.meta.env.VITE_INITIAL_LOGO

// 导航的颜色
// 头部字体颜色
const headerColor = ref<string>("white")
// 头部背景颜色
const headerBg = ref<string>("transparent")
// 导航吸附函数
const _sticky = () => {
  if (document.documentElement.scrollTop > 0) {
    // 有缓存退出
    if (
      headerBg.value === "var(--header-sticky-bg)" &&
      headerColor.value === "var(--header-sticky-color)"
    )
      return
    headerBg.value = "var(--header-sticky-bg)"
    headerColor.value = "var(--header-sticky-color)"
  } else {
    // 有缓存退出
    if (
      headerBg.value === "var(--header-bg)" &&
      headerColor.value === "var(--header-color)"
    )
      return
    headerBg.value = "var(--header-bg)"
    headerColor.value = "var(--header-color)"
  }
}
onMounted(() => {
  _sticky()
  window.addEventListener("scroll", _sticky)
})
onUnmounted(() => {
  window.removeEventListener("scroll", _sticky)
})
</script>

<style scoped lang="scss">
// 引入头部变量
.header {
  color: v-bind(headerColor);
  width: 100%;
  height: var(--header-height);
  @include flex(space-between);
  padding: 0 var(--header-pd);
  background-color: v-bind(headerBg);
  position: fixed;
  box-sizing: border-box;
  top: 0;
  z-index: 10;
  transition: background-color var(--header-bg-during),
    padding var(--header-bg-during);
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
