<template>
  <div
    class="manager-container"
    :style="{
      '--manager-aside-width': `var(--manager-aside-${
        isFold ? 'fold' : 'expand'
      }-width)`,
    }"
  >
    <manager-header></manager-header>
    <manager-content>
      <manager-context>
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </manager-context>
    </manager-content>
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
<style scoped lang="scss">
// 容器 占满屏幕
.manager-container {
  color: var(--primary-color);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
