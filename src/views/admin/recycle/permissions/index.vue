<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="权限名"
      :reset="handlerReset"
      placeholder="权限名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="handlerAllRemove"
          >批量恢复</my-button
        >
      </div>
      <my-table
        :data="tableData"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <my-table-column type="selection" width="30" />
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="name"
          label="权限名"
          align="center"
        />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="desc"
          label="描述"
          align="center"
        />
        <my-table-column
          min-width="100"
          prop="createdAt"
          label="创建时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </my-table-column>
        <my-table-column
          min-width="100"
          prop="updatedAt"
          label="更新时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </my-table-column>
        <!-- 工具栏 -->
        <my-table-column width="90" fixed="right" label="工具栏" align="center">
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <!-- 软删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要恢复《${row.name}》么?`"
                placement="top"
                @confirm="handlerRestore(row)"
              >
                <template #reference>
                  <my-button size="small" class="w-80px !m-0"
                    >恢复权限</my-button
                  >
                </template>
                <template #actions="{ confirm, cancel }">
                  <my-button
                    type="default"
                    class="w-unset"
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
      <my-pagination
        v-if="pagination?.total"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pagination.total"
        :page-sizes="[10, 20, 30]"
        @change="reqPermissions"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        :dark="true"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminRecyclePermissions">
import moment from "@/utils/moment"
// 引入 hooks
import { useMangerPermissionsBase } from "@/hooks/manager/recycle/permissions/useMangerPermissionsBase"
// 引入 接口api
import { managerRestorePermission } from "@/api/recycle"
// 引入 类型
import type { Permission } from "@/api/recycle/types/getRecyclePermission"
import { mitt } from "@/utils/emitter"
const searchKey = ref("")
// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  handleSelectionChange,
  reqPermissions,
  userIds,
  handlerReset,
  currentPage,
  pageSize,
  handlerSearch,

  headerBtnsSize,
  tablePrimaryColumWidth,
} = useMangerPermissionsBase(searchKey)

// 个数变化
const handlerSizeChange = (num: number) => {
  pageSize.value = num
}

// 页数变化
const handlerCurrentPage = (num: number) => {
  currentPage.value = num
}

// 请求的逻辑
const handlerReq = async () => {
  // 只有一条数据时
  if (pagination.value?.total === 1) {
    // 清除 table数据
    tableData.value = []
    return
  }
  // 当前页
  const cur = currentPage.value
  // 上一页
  const pre = cur - 1 <= 0 ? 1 : cur - 1
  // 只有一个的情况
  if (tableData.value.length === 1) {
    // 跳到上一页
    await reqPermissions(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = userIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqPermissions(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqPermissions(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 恢复
const handlerRestore = async (row: Permission) => {
  const { id, name } = row
  try {
    await managerRestorePermission(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`恢复权限${name}成功~`)
  } catch (error) {
    ElMessage.error(`恢复权限${name}失败~`)
  }
}

// 批量恢复
const handlerAllRemove = async () => {
  if (!userIds.value?.length) return ElMessage.warning("没有需要恢复的权限")
  try {
    await Promise.all(
      userIds.value.map(async (item) => {
        try {
          await managerRestorePermission(item)
        } catch (error) {
          ElMessage.error(`批量恢复时,id:${item}恢复失败~`)
        }
      })
    )
    // 重新请求
    if (pagination.value?.total === 1) await reqPermissions()
    else await handlerReq()
    ElMessage.success(`批量恢复成功~`)
  } catch (error) {
    // 重新请求
    if (pagination.value?.total === 1) await reqPermissions()
    else await handlerReq()
    ElMessage.error(`批量恢复失败~`)
  }
}
</script>
