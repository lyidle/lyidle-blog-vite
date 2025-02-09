<template>
  <div class="manager-header">
    header
    <ul class="tools">
      <li>
        <global-setting
          right="50px"
          top="30px"
          bg="white"
          :triangle="{ right: '50px' }"
        ></global-setting>
      </li>
      <!-- 个人项 -->
      <global-header-item :data="PersonData" :menuStyle> </global-header-item>
      <slot name="last-scend"></slot>
      <li class="w-40px h-40px">
        <global-avatar class="!w-100% !h-100%"></global-avatar>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="ManagerHeader">
import { menuStyleType } from "@/components/my-menu/types"
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
.manager-header {
  width: 100%;
  height: $manager-header-height;
  background-color: var(--header-bg);
  color: var(--header-color);
  box-shadow: 1px 1px 3px rgb(117, 112, 112);
  position: relative;
  z-index: $manager-header-index;
  .tools {
    position: absolute;
    right: 0;
    display: flex;
  }
}
</style>
