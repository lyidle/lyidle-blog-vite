<template>
  <div class="manager-aside">
    <my-menu-accordion
      v-if="adminMenuList.length"
      :data="adminMenuList"
      radius="5px"
    >
      <!-- 自定义 图标 -->
      <template #link="{ item }">
        <icon-parse :icon="item.icon"></icon-parse>
        <span class="truncate w-75%">{{ item.meta.title }}</span>
      </template>
    </my-menu-accordion>
  </div>
</template>

<script setup lang="ts" name="ManagerContent">
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取变量
const { adminMenuList } = storeToRefs(useUserStore())
</script>
<style scoped lang="scss">
.manager-aside {
  background-color: var(--aside-bg);
  box-shadow: var(--aside-shadow);
  ::v-deep(.menu-item) {
    height: var(--aside-item-height);
  }
}
</style>
