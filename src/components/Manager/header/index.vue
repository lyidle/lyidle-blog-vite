<template>
  <div class="manager-header">
    <ul class="breadcrumb">
      <!-- 展开和收起按钮 -->
      <li class="start-icon tools-item">
        <i
          :class="isFold ? icons.fold : icons.expand"
          class="cur-pointer"
          @click="isFold = !isFold"
        ></i>
      </li>
      <li class="tools-item">
        <el-breadcrumb>
          <!-- 动态展示路由 -->
          <el-breadcrumb-item
            v-for="(item, index) in $route.matched"
            :key="index"
            v-show="item.meta.title"
            :to="item.path"
          >
            <el-icon v-if="item.meta?.icon">
              <i :class="`${item.meta.icon}`" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </li>
    </ul>
    <ul class="tools">
      <!-- 个人项 -->
      <global-header-item class="tools-item avatar" :data="PersonData">
        <global-avatar></global-avatar>
      </global-header-item>
      <li class="tools-item">
        <global-setting
          right="10px"
          top="50px"
          :triangle="{ right: '0', left: 'unset' }"
        ></global-setting>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="ManagerHeader">
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"
// 引入 图标
import { icons } from "./icon"
// 引入 仓库
import { useManagerStore } from "@/store/manager"
// 提取变量
const { isFold } = storeToRefs(useManagerStore())
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
  background-color: var(--header-bg);
  color: var(--header-color);
  box-shadow: var(--header-shadow);
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
  }
  // 左侧 面包屑
  .breadcrumb {
    height: 100%;
    display: flex;
  }
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
    ::v-deep(.topnav-menu-item) {
      height: $menu-item-height;
      overflow: hidden;
      @include flex(start);
      padding-left: $icon-pl;
      gap: $list-gap;
      > a {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        i,
        svg {
          margin-right: $icon-mr;
        }
      }
    }
  }
}
</style>
