<template>
  <div
    class="manager-container"
    :style="{
      '--manager-aside-width': `var(--manager-aside-${
        isFold ? 'fold' : 'expand'
      }-width)`,
    }"
  >
    <manager-aside></manager-aside>
    <manager-context>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </manager-context>
  </div>
</template>

<script setup lang="ts" name="ManagerLayout">
// 引入 仓库
import { useManagerStore } from "@/store/manager"
// 提取变量
const { isFold } = storeToRefs(useManagerStore())
// 无banner固定 banner
document.body.setAttribute("banner-fixed", "")
</script>
<style lang="scss">
// 设置 卡片 样式
@include setCardStyle(manager);
// 抽屉
.manager-drawer {
  // 设置drawer 的层级
  .drawer-mask {
    z-index: $my-drawer-content;
    background-color: var(--drawer-mask);
  }
  .drawer-content {
    color: var(--primary-color);
    padding: 20px;
    width: clamp(30%, 400px, 60%);
    z-index: $my-drawer-content + 1;
    background-color: var(--drawer-bg);
    .el-form-item__label {
      color: inherit;
    }
  }
}
// 容器 占满屏幕
.manager-container {
  color: var(--primary-color);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  // 左侧
  .manager-aside {
    height: 100%;
    width: var(--manager-aside-width);
    transition: width var(--primary-during);
    position: relative;
    z-index: $manager-aside-index;
  }
  // 右侧
  .manager-context {
    width: calc(100% - var(--manager-aside-width));
    position: relative;
    z-index: $manager-context-index;
    // header
    .manager-header {
      width: 100%;
      height: $manager-header-height;
      position: relative;
      z-index: $manager-header-index;
    }
    // 内容
    .manager-content {
      height: calc(100% - $manager-header-height);
      padding: var(--admin-content-pd);
      padding-top: var(--admin-content-card-gap);
      overflow-x: hidden;
      position: relative;
      z-index: $manager-content-index;
    }
  }
}
</style>
