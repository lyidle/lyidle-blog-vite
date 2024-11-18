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
import { menuListType } from "@/api/header/type"
const title = import.meta.env.VITE_INITIAL_TITLE
const headerBg = ref("transparent")
const headerColor = ref("white")
const menuList = reactive<menuListType[]>([
  {
    id: 1,
    title: "首页",
    icon: "i-ep:home-filled",
    to: "/home",
  },
  {
    id: 2,
    title: "作品",
    icon: "i-mdi:collection",
    to: "",
    data: [
      {
        id: 1,
        name: "test",
        to: "/test",
      },
      {
        id: 2,
        name: "test2",
        to: "/test2",
      },
    ],
  },
  {
    id: 3,
    title: "笔记",
    icon: "i-lucide:notebook-pen",
    to: "/note",
  },
  {
    id: 4,
    title: "筛选",
    icon: "i-tdesign:filter-3-filled",
    to: "",
  },
  {
    id: 5,
    title: "音乐",
    icon: "i-flowbite:list-music-outline",
    to: "",
  },
  {
    id: 6,
    title: "图库",
    icon: "i-jam:picture-f",
    to: "",
  },
  {
    id: 7,
    title: "留言板",
    icon: "i-uil:message",
    to: "",
  },
  {
    id: 8,
    title: "友链",
    icon: "i-heroicons-solid:link",
    to: "",
  },
  {
    id: 9,
    title: "简介",
    icon: "i-iconoir:page-star",
    to: "",
  },
])
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
