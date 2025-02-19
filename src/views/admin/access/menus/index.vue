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
          <template #="{ row }">
            <div class="flex flex-wrap gap-10px justify-center btns-tools">
              <my-button class="w-70px !m-0" size="small" type="default" plain
                >添加菜单</my-button
              >
              <my-button
                class="w-70px !m-0"
                type="warning"
                plain
                size="small"
                @click="editor.init(row)"
                >编辑</my-button
              >
              <my-button class="w-70px !m-0" type="danger" plain size="small"
                >软删除</my-button
              >
              <my-button class="w-70px !m-0" type="danger" plain size="small"
                >删除</my-button
              >
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <manager-com-menu-editor
        ref="editor"
        @req="handlerReq"
      ></manager-com-menu-editor>
    </my-card>
  </div>
</template>
<script lang="ts" setup name="AdminAccessUsers">
// 引入 api
import { getAllMenuList } from "@/api/admin"
// 引入 类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取请求
const { reqUserInfo } = useUserStore()
// 提取数据
const { userRoles } = storeToRefs(useUserStore())
// 表格数据
const tableData = ref<GetMenuList["data"]>([])
const toolBtnsWidth = ref()
// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    toolBtnsWidth.value = 340
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

// 获取子组件实例
const editor = ref()

// 发起请求
const handlerReq = async () => {
  const result = await getAllMenuList()
  // 重新获取用户数据
  await reqUserInfo()
  // 重新加载路由
  mitt.emit("route:reload")
  // 重新判断权限
  mitt.emit("authRoles", userRoles.value)
  if (result) tableData.value = result
}
onMounted(async () => {
  await handlerReq()
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
