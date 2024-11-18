<template>
  <div class="header" ref="header">
    <div class="logo text">
      <router-link to="/">{{ title }}</router-link>
    </div>
    <layout-topnav :menuList :headerColor></layout-topnav>
    <layout-topnav-mini :menuList></layout-topnav-mini>
  </div>
</template>

<script setup lang="ts" name="LayoutHeader">
// 引入store
import { useSettingStore } from "@/store/setting"
import { useUserStore } from "@/store/user"
// 把pinia的数据动态化
const { headerColor, headerBg } = storeToRefs(useSettingStore())
const { menuList } = storeToRefs(useUserStore())
const title = import.meta.env.VITE_INITIAL_TITLE
const el = document.documentElement
// getComputedStyle是事实的
const result = getComputedStyle(el).getPropertyValue(`--primary-color`)
// 导航吸附函数
const _sticky = () => {
  if (document.documentElement.scrollTop > 0) {
    headerBg.value = "rgba(255,255,255,.8)"
    headerColor.value = result
  } else {
    headerBg.value = "transparent"
    headerColor.value = "white"
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
  @include flex-center(space-between);
  background-color: var(--header-bg);
  padding: 0 var(--header-pd);
  background-color: v-bind(headerBg);
  position: fixed;
  top: 0;
  transition: background-color var(--header-bg-during);
  .logo {
    font-family: "LOGO";
    > a {
      color: v-bind(headerColor);
    }
  }
}
</style>
