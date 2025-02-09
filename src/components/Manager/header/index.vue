<template>
  <div class="manager-header">
    header
    <ul class="tools">
      <li class="tools-item">
        <global-setting
          right="-40px"
          top="50px"
          :triangle="{ right: '50px' }"
          bg="white"
        ></global-setting>
      </li>
      <!-- 个人项 -->
      <global-header-item class="tools-item" :data="PersonData" :menuStyle>
      </global-header-item>
      <li class="tools-item avatar">
        <global-avatar></global-avatar>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="ManagerHeader">
import { menuStyleType } from "@/components/my/menu/types"
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"
// 悬浮菜单的样式
const menuStyle: menuStyleType = {
  bg: "white",
  bgHover: "white",
  color: "black",
  colorHover: "black",
}
// 个人页面
const PersonData = useShowPersonHeaderMenu()
</script>
<style scoped lang="scss">
$menu-item-height: var(--header-topmenu-h);
$icon-mr: var(--header-topmenu-icon-mr);
$icon-pl: var(--header-topmenu-icon-pl);
$list-gap: 5px;
$item-left: var(--header-topmenu-margin-left);
$underline-height: var(--header-topnav-mask-height);
$underline-bg: var(--header-topnav-mask-color);
$avatar-size: $manager-header-height - 10;
.manager-header {
  width: 100%;
  height: $manager-header-height;
  background-color: var(--header-bg);
  color: var(--header-color);
  box-shadow: 1px 1px 3px rgb(117, 112, 112);
  position: relative;
  z-index: $manager-header-index;
  // 右侧 工具 栏
  .tools {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    height: 100%;
    align-items: center;
    // 导航项目
    .tools-item {
      margin-left: $item-left;
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
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
      position: relative;
      // 导航下划线
      &:not(.avatar)::before {
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
      ::v-deep(.avatar) {
        width: $avatar-size;
        height: $avatar-size;
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
}
</style>
