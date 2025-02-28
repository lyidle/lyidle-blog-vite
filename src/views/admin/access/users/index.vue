<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="用户名"
      :reset="handlerReset"
      placeholder="请输入用户名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init()"
          >添加用户</my-button
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
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <my-table-column type="selection" width="30" />
        <my-table-column
          width="40"
          prop="id"
          label="id"
          fixed="left"
          align="center"
        />
        <my-table-column
          :width="accountsWidth"
          prop="account"
          label="账号"
          fixed="left"
          align="center"
        />
        <my-table-column
          :width="accountsWidth"
          prop="nickName"
          label="用户名"
          fixed="left"
          align="center"
        />
        <my-table-column width="200" prop="email" label="邮箱" align="center" />
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
        <my-table-column :width="toolBtnsWidth" label="工具栏" align="center">
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <my-button
                size="small"
                class="w-80px !m-0"
                @click="assignRole.init(row)"
                >分配角色</my-button
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
              <el-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要把《${row.account}》回收到垃圾桶么?`"
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
              </el-popconfirm>
              <!-- 删除 -->
              <el-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要彻底删除《${row.account}》么?`"
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
              </el-popconfirm>
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
        @change="reqUsers"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        :dark="true"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />
    </my-card>
    <manager-com-user-assign-roles
      ref="assignRole"
      @req="handlerReq"
    ></manager-com-user-assign-roles>
    <manager-com-user-editor
      ref="editor"
      @req="handlerReq"
    ></manager-com-user-editor>
    <manager-com-user-create
      ref="create"
      @req="handlerReq"
    ></manager-com-user-create>
  </div>
</template>

<script setup lang="ts" name="AdminAccessUsers">
import moment from "@/utils/moment"
// 引入 hooks
import { useManagerUserBase } from "@/hooks/manager/access/user/useManagerUserBase"
// 引入 接口api
import { managerRemoveUser, managerDeleteUser } from "@/api/user"
// 引入 类型
import type { User } from "@/api/user/types/searchUserPagination"
import { mitt } from "@/utils/emitter"
const searchKey = ref("")
// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  handleSelectionChange,
  reqUsers,
  userIds,
  handlerReset,
  headerBtnsSize,
  currentPage,
  pageSize,

  accountsWidth,
  handlerSearch,
  toolBtnsWidth,
  isSmall,
} = useManagerUserBase(searchKey)

// 获取子组件示例 用于分配角色按钮的点击事件
const assignRole = ref()
// 编辑用户
const editor = ref()
// 创建用户
const create = ref()
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
  const pre = cur - 1 || 1
  // 只有一个的情况
  if (tableData.value.length === 1) {
    // 跳到上一页
    await reqUsers(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = userIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqUsers(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqUsers(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 软删除
const handlerRemove = async (row: User) => {
  const { id, account } = row
  try {
    // 回收到垃圾桶
    await managerRemoveUser(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`移动${account}用户到垃圾桶成功~`)
  } catch (error) {
    ElMessage.warning(`移动${account}用户到垃圾桶失败~`)
  }
}

// 删除
const handlerDelete = async (row: User) => {
  const { id, account } = row
  try {
    // 彻底删除
    await managerDeleteUser(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${account}用户成功~`)
  } catch (error) {
    ElMessage.warning(`彻底删除${account}用户失败~`)
  }
}

// 批量软删除
const handlerAllRemove = async () => {
  let id: number
  if (!userIds.value?.length) return ElMessage.warning("没有需要删除的用户哦~")
  try {
    await Promise.all(
      userIds.value.map(async (item) => {
        id = item
        try {
          // 软删除
          await managerRemoveUser(id)
        } catch (error) {}
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量删除成功,已成功移动到垃圾桶~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
    ElMessage.warning(`批量删除时,id:${id!}删除失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  let id: number
  if (!userIds.value?.length) return ElMessage.warning("没有需要删除的用户哦~")
  try {
    await Promise.all(
      userIds.value.map(async (item) => {
        id = item
        try {
          // 彻底删除
          await managerDeleteUser(id)
        } catch (error) {}
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
    ElMessage.warning(`批量删除时,id:${id!}删除失败~`)
  }
}
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
