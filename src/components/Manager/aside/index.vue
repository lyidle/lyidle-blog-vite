<template>
  <div class="manager-aside">
    <my-menu-accordion
      v-if="adminMenuList?.[0]?.children?.length"
      :data="adminMenuList[0].children"
    ></my-menu-accordion>
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
  height: 100%;
  width: var(--manager-aside-width);
  background-color: gray;
  transition: width var(--primary-during);
  position: relative;
  z-index: $manager-aside-index;
}
</style>
