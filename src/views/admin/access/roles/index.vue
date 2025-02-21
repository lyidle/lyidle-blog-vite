<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="角色名"
      :reset="handlerReset"
      placeholder="请输入角色名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init()"
          >添加角色</my-button
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
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
      >
        <el-table-column type="selection" width="30" />
        <el-table-column
          width="40"
          prop="id"
          label="id"
          align="center"
          fixed="left"
        />
        <el-table-column
          :width="accountsWidth"
          prop="name"
          label="name"
          align="center"
          fixed="left"
        />
        <el-table-column prop="desc" label="desc" align="center" />
        <el-table-column
          min-width="100"
          prop="createdAt"
          label="创建时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="updatedAt"
          label="更新时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </el-table-column>
        <!-- 工具栏 -->
        <el-table-column :width="toolBtnsWidth" label="工具栏" align="center">
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <my-button
                size="small"
                class="w-80px !m-0"
                @click="assignGroup.init(row)"
                >分配权限组</my-button
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
              </el-popconfirm>
              <!-- 删除 -->
              <el-popconfirm
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
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <el-pagination
        v-if="pagination?.total"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pagination.total"
        :page-sizes="[10, 20, 30]"
        @change="reqAllRoles"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        :default-current-page="currentPage"
        :default-page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-role-create ref="create" @req="handlerReq" />
      <manager-com-role-editor ref="editor" @req="handlerReq" />
      <manager-com-role-assign-groups
        ref="assignGroup"
        @req="handlerReq"
      ></manager-com-role-assign-groups>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessRoles">
// 引入 api
import { deleteRole, removeRole } from "@/api/admin"
// 引入 类型
import { Role } from "@/api/admin/types/findAllRolesPagination"
// 引入 基础配置
import { useMangerRolesBase } from "@/hooks/manager/access/roles/useMangerRolesBase"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 自制moment
import moment from "@/utils/moment"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取请求
const { reqUserInfo } = useUserStore()
// 提取数据
const { userRoles } = storeToRefs(useUserStore())
// 搜索 的key
const searchKey = ref("")
// 使用 基础配置
const {
  handlerSearch,
  tableData,
  pagination,
  reqAllRoles,
  handlerReset,

  headerBtnsSize,
  accountsWidth,
  toolBtnsWidth,
  isSmall,
} = useMangerRolesBase(searchKey)
// 当前页
const currentPage = ref(1)
// 分页器个数
const pageSize = ref(10)
// 个数变化
const handlerSizeChange = (num: number) => {
  pageSize.value = num
}
// 页数变化
const handlerCurrentPage = (num: number) => {
  currentPage.value = num
}

// 保存选中的 roleId
const roleIds = ref<number[]>([])
// 选择状态发生变化
const handleSelectionChange = (role: Role[]) => {
  roleIds.value = role.map((item) => item.id)
}

// 子组件实例
const create = ref()
const editor = ref()
const assignGroup = ref()
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
    await reqAllRoles(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = roleIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqAllRoles(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqAllRoles(cur, pageSize.value)
  // 重新获取用户数据
  await reqUserInfo()
  // 重新加载路由
  mitt.emit("route:reload")
  // 重新判断权限
  mitt.emit("authRoles", userRoles.value)
}

// 软删除
const handlerRemove = async (row: Role) => {
  const { id, name } = row
  try {
    // 回收到垃圾桶
    await removeRole(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`移动${name}角色到垃圾桶成功~`)
  } catch (error) {
    ElMessage.warning(`移动${name}角色到垃圾桶失败~`)
  }
}

// 删除
const handlerDelete = async (row: Role) => {
  const { id, name } = row
  try {
    // 彻底删除
    await deleteRole(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${name}角色成功~`)
  } catch (error) {
    ElMessage.warning(`彻底删除${name}角色失败~`)
  }
}

// 批量软删除
const handlerAllRemove = async () => {
  let id: number
  try {
    await Promise.all(
      roleIds.value.map(async (item) => {
        id = item
        try {
          // 软删除
          await removeRole(id)
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
  try {
    await Promise.all(
      roleIds.value.map(async (item) => {
        id = item
        try {
          // 彻底删除
          await deleteRole(id)
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
