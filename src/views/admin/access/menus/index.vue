<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button @click="create.init()" :size="headerBtnsSize" class="!w-90px"
          >添加菜单</my-button
        >
      </div>
      <my-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        show-overflow-tooltip
        height="65vh"
      >
        <my-table-column prop="name" label="菜单名" width="160" />
        <my-table-column prop="to" label="路径" align="center" />
        <my-table-column prop="icon" width="60" label="图标" align="center">
          <template #="{ row }">
            <icon-parse :icon="row.icon"></icon-parse>
          </template>
        </my-table-column>
        <my-table-column prop="roles" label="权限值" align="center" />
        <my-table-column prop="updatedAt" label="修改时间" align="center">
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </my-table-column>
        <my-table-column
          label="工具栏"
          :width="toolBtnsWidth"
          fixed="right"
          align="center"
          class="tools-btns"
        >
          <template #="{ row }">
            <div class="flex flex-wrap gap-10px justify-center btns-tools">
              <my-button
                class="w-70px !m-0"
                size="small"
                @click="create.init(row)"
                type="default"
                plain
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

              <!-- 软删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要把《${row.name}》回收到垃圾桶么?`"
                placement="top"
                @confirm="handlerRemove(row)"
              >
                <template #reference>
                  <my-button
                    class="w-70px !m-0"
                    size="small"
                    type="danger"
                    plain
                    >软删除</my-button
                  >
                </template>
                <template #actions="{ confirm, cancel }">
                  <my-button
                    class="w-unset"
                    type="default"
                    size="small"
                    @click="cancel"
                    >否</my-button
                  >
                  <my-button
                    class="w-unset"
                    type="danger"
                    size="small"
                    @click="confirm"
                  >
                    是
                  </my-button>
                </template>
              </my-popconfirm>
              <!-- 删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要彻底删除《${row.name}》么?`"
                placement="top"
                @confirm="handlerDelete(row)"
              >
                <template #reference>
                  <my-button
                    class="w-70px !m-0"
                    size="small"
                    type="danger"
                    plain
                    >删除</my-button
                  >
                </template>
                <template #actions="{ confirm, cancel }">
                  <my-button
                    class="w-unset"
                    type="default"
                    size="small"
                    @click="cancel"
                    >否</my-button
                  >
                  <my-button
                    class="w-unset"
                    type="danger"
                    size="small"
                    @click="confirm"
                  >
                    是
                  </my-button>
                </template>
              </my-popconfirm>
            </div>
          </template>
        </my-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <my-empty />
          </div>
        </template>
      </my-table>
      <manager-com-menu-create
        ref="create"
        @req="handlerReq"
      ></manager-com-menu-create>
      <manager-com-menu-editor
        ref="editor"
        @req="handlerReq"
      ></manager-com-menu-editor>
    </my-card>
  </div>
</template>
<script lang="ts" setup name="AdminAccessUsers">
// 引入 api
import {
  managerDeleteMenuList,
  getAllMenuList,
  managerRemoveMenuList,
} from "@/api/admin"
// 引入 类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import type { Datum } from "@/api/admin/types/getMenuList"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 自制moment
import moment from "@/utils/moment"
// 表格数据
const tableData = ref<GetMenuList["data"]>([])
// 大小
const toolBtnsWidth = ref()
const headerBtnsSize = ref()
// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    toolBtnsWidth.value = 340
    headerBtnsSize.value = "default"
    return
  }
  toolBtnsWidth.value = 100
  headerBtnsSize.value = "small"
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

onBeforeUnmount(() => {
  // 卸载监听窗口变化
  mitt.off("window:resize", handlerResize)
})

// 获取子组件实例
const editor = ref()
const create = ref()

// 只允许 修改时触发重载和权限判断
let only = false
// 发起请求
const handlerReq = async () => {
  const result = await getAllMenuList()
  // 只允许 修改时触发重载和权限判断
  if (only)
    // 重新加载路由
    mitt.emit("route:reload")
  only = true
  if (result) tableData.value = result
}

// 软删除
const handlerRemove = async (row: Datum) => {
  const { id, name } = row
  try {
    // 回收到垃圾桶
    await managerRemoveMenuList(id as number)
    // 重新请求
    await handlerReq()
    ElMessage.success(`移动${name}菜单到垃圾桶成功~`)
  } catch (error) {
    ElMessage.error(`移动${name}菜单到垃圾桶失败~`)
  }
}

// 删除
const handlerDelete = async (row: Datum) => {
  const { id, name } = row
  try {
    // 彻底删除
    await managerDeleteMenuList(id as number)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${name}菜单成功~`)
  } catch (error) {
    ElMessage.error(`彻底删除${name}菜单失败~`)
  }
}

onMounted(async () => {
  await handlerReq()
  // 处理 窗口变化 的事件
  handlerResize()
})
</script>
