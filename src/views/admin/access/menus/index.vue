<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        show-overflow-tooltip
        height="70vh"
      >
        <el-table-column prop="name" label="名称" width="160" />
        <el-table-column prop="roles" label="权限值" align="center" />
        <el-table-column prop="updatedAt" label="修改时间" align="center" />
        <el-table-column
          label="工具栏"
          :width="toolBtnsWidth"
          fixed="right"
          align="center"
          class="tools-btns"
        >
          <div class="flex flex-wrap gap-10px justify-center btns-tools">
            <my-button class="w-70px !m-0" size="small">添加菜单</my-button>
            <my-button class="w-70px !m-0" size="small">编辑</my-button>
            <my-button class="w-70px !m-0" size="small">删除</my-button>
          </div>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
    </my-card>
  </div>
</template>
<script lang="ts" setup name="AdminAccessUsers">
// 引入 api
import { getAllMenuList } from "@/api/admin"
// 引入 类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import { mitt } from "@/utils/emitter"
// 表格数据
const tableData = ref<GetMenuList["data"]>([])
const toolBtnsWidth = ref()
// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    toolBtnsWidth.value = 260
    return
  }
  toolBtnsWidth.value = 150
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

onBeforeUnmount(() => {
  // 卸载监听窗口变化
  mitt.off("window:resize", handlerResize)
})
onMounted(async () => {
  const result = await getAllMenuList()
  if (result) tableData.value = result
  // 处理 窗口变化 的事件
  handlerResize()
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
