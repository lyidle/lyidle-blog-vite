<template>
  <div class="manager-aside">
    <my-menu-accordion
      v-if="adminMenuList.length"
      :data="adminMenuList"
      radius="5px"
      :isActive="true"
      :isExpand="true"
    >
      <!-- 自定义 图标 -->
      <template #link="{ item }">
        <icon-parse :icon="isIcon(item.path)"></icon-parse>
        <span class="truncate w-75%">{{ item.meta.title }}</span>
      </template>
    </my-menu-accordion>
  </div>
</template>

<script setup lang="ts" name="ManagerContent">
// 引入 类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取变量
const { adminMenuList, adminMenuListRaw } = storeToRefs(useUserStore())

const handlerIcon = (
  adminMenuListRaw: GetMenuList["data"],
  to: string
): string => {
  // 递归查找 adminMenuListRaw 中有无 icon
  // 根据 to 来判断
  const findIcon = (menuList: GetMenuList["data"]): string => {
    if (!menuList) return ""
    for (const menu of menuList) {
      if (menu.to === to) {
        return menu.icon || ""
      }
      if (menu.children) {
        const icon = findIcon(menu.children)
        if (icon) {
          return icon
        }
      }
    }
    return ""
  }

  return findIcon(adminMenuListRaw || [])
}
const isIcon = (to: string) => {
  return handlerIcon(adminMenuListRaw.value, to)
}
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
