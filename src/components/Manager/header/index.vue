<template>
  <div class="manager-header">
    <ul class="breadcrumb">
      <!-- 展开和收起按钮 -->
      <li class="start-icon manager-header-item">
        <i
          :class="isFold ? icons.fold : icons.expand"
          class="cur-pointer"
          @click="isFold = !isFold"
        ></i>
      </li>
    </ul>
    <ul class="tools">
      <!-- 个人项 -->
      <global-header-item
        class="manager-header-item avatar"
        v-model:data="PersonData"
        top="40px"
      >
        <global-avatar :isCenter="false"></global-avatar>
      </global-header-item>
      <!-- 设置 -->
      <li class="manager-header-item">
        <global-setting
          right="10px"
          top="60px"
          :triangle="{ right: '0', left: 'unset' }"
        >
          <el-form-item
            :label="`${autoFold ? '自动' : '手动'}折叠侧边栏`"
            class="item aside-switch"
          >
            <el-switch
              v-model="autoFold"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
              class="settingSwitch"
            />
          </el-form-item>
        </global-setting>
      </li>
      <!-- 返回 -->
      <li class="manager-header-item">
        <icon-parse
          icon="i-f7:gobackward"
          class="icon w-20px h-20px"
        ></icon-parse>
        <!-- 当没有上个路径信息时replace 到 /  -->
        <a @click="goBack">返回</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="ManagerHeader">
// 引入 图标
import aside from "@/components/icon/switch/aside.vue"
import unaside from "@/components/icon/switch/unaside.vue"
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"
// 引入 图标
import { icons } from "./icon"
// 引入 仓库
import { useManagerStore } from "@/store/manager"
// 回到上一个路径
import { useGoBack } from "@/hooks/useGoBack"
const goBack = useGoBack()
// 提取变量
const { isFold, autoFold } = storeToRefs(useManagerStore())
// 个人页面
const PersonData = useShowPersonHeaderMenu()
</script>
<style scoped lang="scss">
$menu-item-height: var(--header-topmenu-h);
$icon-mr: var(--header-topmenu-icon-mr);
$list-gap: 5px;
$item-left: var(--header-topmenu-margin-left);
$underline-height: var(--header-topnav-mask-height);
$underline-bg: var(--header-topnav-mask-color);
$avatar-size: $manager-header-height - 10;
$color: var(--header-color);
.manager-header {
  background-color: var(--header-bg);
  color: $color;
  box-shadow: var(--header-shadow);
  .icon {
    margin-right: $icon-mr;
  } // 左侧 面包屑
  .breadcrumb {
    height: 100%;
    display: flex;
  }
  // 右侧 工具的样式
  .tools {
    margin-right: $item-left;
  }
  // 导航项目
  .manager-header-item {
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
  // 右侧 工具 栏
  .tools {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    height: 100%;
    align-items: center;
    // 导航项目
    .manager-header-item {
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
