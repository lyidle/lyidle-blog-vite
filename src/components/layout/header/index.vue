<template>
  <div class="global-header" ref="header">
    <div class="logo">
      <router-link to="/">{{ LOGO }}</router-link>
    </div>
    <layout-header-topnav :menuStyle></layout-header-topnav>
    <layout-header-topnav-mini :menuStyle></layout-header-topnav-mini>
  </div>
</template>

<script setup lang="ts" name="LayoutHeader">
import { observer, ObserverCallback } from "@/utils/observer"
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"

const LOGO = import.meta.env.VITE_INITIAL_LOGO
// 悬浮菜单的样式
const menuStyle: menuStyleType = {
  bg: "var(--header-menu-bg)",
  bgHover: "var(--header-menu-bg-hover)",
  color: "var(--header-menu-color)",
  colorHover: "var(--header-menu-color-hover)",
}
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
$menu-item-height: var(--header-topmenu-h);
$icon-mr: var(--header-topmenu-icon-mr);
$icon-pl: var(--header-topmenu-icon-pl);
$list-gap: 5px;
::v-deep(.topnav) {
  // 导航项目
  > li {
    margin-left: var(--header-topmenu-margin-left);
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
      height: var(--header-topnav-mask-height);
      background-color: var(--header-topnav-mask-color);
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
    padding-left: $icon-pl;
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
