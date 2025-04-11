<template>
  <div
    class="manager-container"
    :style="{
      '--manager-aside-width': `var(--manager-aside-${
        isFold ? 'fold' : 'expand'
      }-width)`,
    }"
    :class="isFold ? 'fold-container' : ''"
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
import { mitt } from "@/utils/emitter"
// 提取变量
const { isFold, autoFold } = storeToRefs(useManagerStore())
// 无banner固定 banner
document.body.setAttribute("banner-fixed", "")

// 小屏尺寸 自动折叠
const mini = 768
const autoFoldCallback = () => {
  if (!autoFold.value) return
  if (window.innerWidth <= mini) {
    isFold.value = true
  } else {
    isFold.value = false
  }
}

onMounted(autoFoldCallback)
watch(
  () => autoFold.value,
  (is) => {
    // 清除上一次的
    mitt.off("window:resize", autoFoldCallback)
    if (!is) return
    autoFoldCallback()
    // 绑定这一次的
    mitt.on("window:resize", autoFoldCallback)
  },
  {
    immediate: true,
  }
)
onBeforeUnmount(() => mitt.off("window:resize", autoFoldCallback))
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
  &.fold-container {
    .menu-item {
      .start-icon {
        text-wrap: nowrap;
        a {
          margin: unset;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
          span {
            transition: width var(--primary-during);
            width: 0;
            overflow: hidden;
          }
        }
      }

      .toggle {
        transition: width var(--primary-during);
        width: 0;
        overflow: hidden;
      }
    }
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
