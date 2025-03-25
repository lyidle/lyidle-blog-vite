<template>
  <div class="global-header" ref="header">
    <div class="logo">
      <router-link to="/">{{ LOGO }}</router-link>
    </div>
    <layout-header-topnav></layout-header-topnav>
    <layout-header-topnav-mini></layout-header-topnav-mini>
  </div>
</template>

<script setup lang="ts" name="LayoutHeader">
import { createIntersectionObserver, ObserverCallback } from "@/utils/observer"

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
  // 有 banner 则代理动态吸附
  const el = document.querySelector(".banner-createIntersectionObserver")
  el && createIntersectionObserver(el, options)
  // 没有 的 则是没有图片背景的
  // 需要修改默认显示的颜色
  if (!el) {
    headerBg.value = "var(--header-bg-sticky)"
    headerColor.value = "var(--header-color-sticky)"
  }
})
onUnmounted(() => {
  options.stop?.()
})
</script>

<style scoped lang="scss">
$menu-item-height: var(--header-topmenu-h);
$icon-mr: var(--header-topmenu-icon-mr);
$list-gap: 5px;
$item-left: var(--header-topmenu-margin-left);
$underline-height: var(--header-topnav-mask-height);
$underline-bg: var(--header-topnav-mask-color);
::v-deep(.topnav) {
  // 导航项目
  > li {
    margin-left: $item-left;
    position: relative;
    height: 100%;
    > a {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      > i,
      svg {
        margin-right: $icon-mr;
      }
    }
    // 导航下划线
    &::before {
      content: "";
      display: block;
      width: 0;
      height: $underline-height;
      background-color: $underline-bg;
      position: absolute;
      bottom: 5px;
      transition: 0.3s;
    }
    &:hover:before {
      width: 100%;
    }
  }
  // 悬浮的菜单项目
  .topnav-menu-item {
    height: $menu-item-height;
    overflow: hidden;
    @include flex(start);
    gap: $list-gap;
  }
}
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
  @include media(xs) {
    padding: 0 13px;
  }
  .logo {
    font-family: "LOGO";
  }
}
</style>
