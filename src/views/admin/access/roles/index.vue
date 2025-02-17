<template>
  <div class="admin-container">
    <my-search-admin :submit="handlerSearch"> </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >添加用户</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >批量软删除</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >批量删除</my-button
        >
      </div>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessRoles">
import { mitt } from "@/utils/emitter"
// 头部的按钮大小
const headerBtnsSize = ref("default")

// 搜索回调
const handlerSearch = (key: string) => {
  ElMessage(key)
}

// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    // 头部的按钮大小
    headerBtnsSize.value = "default"
    return
  }
  // 头部的按钮大小
  headerBtnsSize.value = "small"
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

import { findALlRoles } from "@/api/admin"

// pagination  的回调
// 获取用户
const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
  try {
    await findALlRoles()
  } catch (error) {}
}

onMounted(async () => {
  // 得到 用户
  await reqUsers()
  // 处理 窗口变化 的事件
  handlerResize()
})

onBeforeUnmount(() => {
  // 卸载监听窗口变化
  mitt.off("window:resize", handlerResize)
})
</script>

<style scoped lang="scss">
.admin-container {
  display: flex;
  flex-direction: column;
  gap: var(--admin-content-card-gap);
  @include adminHeaderBtns;
  .admin-content {
    padding: var(--admin-content-card-pd);
  }
}
</style>
