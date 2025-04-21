<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="权限组"
      :reset="handlerReset"
      placeholder="请输入权限组名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init()"
          >添加权限组</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="handlerAllRemove"
          >批量软删除</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="handlerAllDelete"
          >批量删除</my-button
        >
      </div>
      <my-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
      >
        <my-table-column type="selection" width="30" />
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="name"
          label="权限组名"
          align="center"
        />
        <my-table-column prop="desc" label="描述" align="center" />
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
        <my-table-column
          :width="toolBtnsWidth"
          fixed="right"
          label="工具栏"
          align="center"
        >
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <my-button
                size="small"
                class="w-80px !m-0"
                @click="assignGroup.init(row)"
                >分配权限</my-button
              >
              <my-button
                size="small"
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '50px' }"
                type="warning"
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
                    class="!m-0"
                    :style="{ width: isSmall ? '80px' : '50px' }"
                    size="small"
                    type="danger"
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
                    class="!m-0"
                    :style="{ width: isSmall ? '80px' : '50px' }"
                    size="small"
                    type="danger"
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
      <my-pagination
        v-if="pagination?.total"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pagination.total"
        :page-sizes="[10, 20, 30]"
        @change="reqAllGroups"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-group-create ref="create" @req="handlerReq" />
      <manager-com-group-editor ref="editor" @req="handlerReq" />
      <manager-com-group-assign-permissions
        ref="assignGroup"
        @req="handlerReq"
      ></manager-com-group-assign-permissions>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessGroups">
// 引入 api
import { managerDeleteGroups, managerRemoveGroups } from "@/api/admin"
// 引入 类型
import { Role } from "@/api/admin/types/findAllRolesPagination"
// 引入 基础配置
import { useMangerGroupsBase } from "@/hooks/manager/access/groups/useMangerGroupsBase"
// 引入 自制moment
import moment from "@/utils/moment"
import { handlerReqErr } from "@/utils/request/error/successError"
// 搜索 的key
const searchKey = ref("")
// 使用 基础配置
const {
  handlerSearch,
  tableData,
  pagination,
  reqAllGroups,
  handlerReset,
  currentPage,
  pageSize,

  headerBtnsSize,
  tablePrimaryColumWidth,
  toolBtnsWidth,
  isSmall,
} = useMangerGroupsBase(searchKey)
// 个数变化
const handlerSizeChange = (num: number) => {
  pageSize.value = num
}
// 页数变化
const handlerCurrentPage = (num: number) => {
  currentPage.value = num
}

// 保存选中的 roleId
const groupIds = ref<number[]>([])
// 选择状态发生变化
const handleSelectionChange = (role: Role[]) => {
  groupIds.value = role
    .map((item) => item.children && item.id)
    .filter(Boolean) as number[]
}

// 子组件实例
const create = ref()
const editor = ref()
const assignGroup = ref()
// 请求的逻辑
const handlerReq = async (stay?: boolean) => {
  // 当前页
  const cur = currentPage.value
  // 上一页
  const pre = cur - 1 <= 0 ? 1 : cur - 1

  if (stay) {
    // 默认是 当前页 和分页器的个数
    await reqAllGroups(cur, pageSize.value)
    return
  }

  // 只有一条数据时
  if (pagination.value?.total === 1) {
    // 清除 table数据
    tableData.value = []
    return
  }

  // 只有一个的情况
  if (tableData.value.length === 1) {
    // 跳到上一页
    await reqAllGroups(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = groupIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqAllGroups(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqAllGroups(cur, pageSize.value)
}

// 软删除
const handlerRemove = async (row: Role) => {
  const { id, name } = row
  try {
    // 回收到垃圾桶
    await managerRemoveGroups(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`移动${name}权限组到垃圾桶成功~`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error(`移动${name}权限组到垃圾桶失败~`)
  }
}

// 删除
const handlerDelete = async (row: Role) => {
  const { id, name } = row
  try {
    // 彻底删除
    await managerDeleteGroups(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${name}权限组成功~`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error(`彻底删除${name}权限组失败~`)
  }
}

// 批量软删除
const handlerAllRemove = async () => {
  if (!groupIds.value?.length)
    return ElMessage.warning("没有需要软删除的权限组")
  try {
    await Promise.all(
      groupIds.value.map(async (item) => {
        try {
          // 软删除
          await managerRemoveGroups(item)
        } catch (error) {
          ElMessage.error(`批量软删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    if (pagination.value?.total === 1) await reqAllGroups()
    else await handlerReq()
    ElMessage.success(`批量软删除成功,已成功移动到垃圾桶~`)
  } catch (error) {
    // 重新请求
    if (pagination.value?.total === 1) await reqAllGroups()
    else await handlerReq()
    ElMessage.error(`批量软删除失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!groupIds.value?.length)
    return ElMessage.warning("没有需要彻底删除的权限组")
  try {
    await Promise.all(
      groupIds.value.map(async (item) => {
        try {
          // 彻底删除
          await managerDeleteGroups(item)
        } catch (error) {
          ElMessage.error(`批量彻底删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    if (pagination.value?.total === 1) await reqAllGroups()
    else await handlerReq()
    ElMessage.success(`批量彻底删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    if (pagination.value?.total === 1) await reqAllGroups()
    else await handlerReq()
    ElMessage.error(`批量彻底删除失败~`)
  }
}
</script>
