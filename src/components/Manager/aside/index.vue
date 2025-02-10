<template>
  <div class="manager-aside">
    <my-menu-accordion
      v-if="adminMenuList.length"
      :data="adminMenuList"
      radius="5px"
    ></my-menu-accordion>
  </div>
</template>

<script setup lang="ts" name="ManagerContent">
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取变量
const { adminMenuList } = storeToRefs(useUserStore())
// 提取处理路由的函数
const { reqAdminMenuList } = useUserStore()
onMounted(() => {
  reqAdminMenuList()
})
</script>
<style scoped lang="scss">
.manager-aside {
  background-color: var(--aside-bg);
  box-shadow: var(--aside-shadow);
}
</style>
