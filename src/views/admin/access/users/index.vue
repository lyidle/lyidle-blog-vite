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
          @click="create.initCreate()"
          >添加用户</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >批量删除</my-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="40vh"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
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
          prop="account"
          label="账号"
          fixed="left"
          align="center"
        />
        <el-table-column
          :width="accountsWidth"
          prop="nickName"
          label="用户名"
          fixed="left"
          align="center"
        />
        <el-table-column width="200" prop="email" label="邮箱" align="center" />
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
        <el-table-column width="295" label="工具栏" align="center">
          <template #="{ row }">
            <my-button
              size="small"
              class="w-80px"
              @click="assignRole.initDrawer(row)"
              >分配角色</my-button
            >
            <my-button
              size="small"
              class="w-50px"
              type="warning"
              @click="editor.initEditor(row)"
              >编辑</my-button
            >

            <!-- 软删除 -->
            <el-popconfirm
              width="220"
              icon-color="#F56C6C"
              :title="`确认要把《${row.account}》回收到垃圾桶么?`"
              placement="top"
              @confirm="handlerRemove(row.id)"
            >
              <template #reference>
                <my-button class="w-50px" size="small" type="danger"
                  >软删除</my-button
                >
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">否</el-button>
                <el-button type="danger" size="small" @click="confirm">
                  是
                </el-button>
              </template>
            </el-popconfirm>
            <!-- 删除 -->
            <el-popconfirm
              width="220"
              icon-color="#F56C6C"
              :title="`确认要彻底删除《${row.account}》么?`"
              placement="top"
              @confirm="handlerDelete(row.id)"
            >
              <template #reference>
                <my-button class="w-50px" size="small" type="danger"
                  >删除</my-button
                >
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">否</el-button>
                <el-button type="danger" size="small" @click="confirm">
                  是
                </el-button>
              </template>
            </el-popconfirm>
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
        @change="reqUsers"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />
    </my-card>
    <manager-com-user-assign-roles
      ref="assignRole"
    ></manager-com-user-assign-roles>
    <manager-com-user-editor ref="editor"></manager-com-user-editor>
    <manager-com-user-create ref="create"></manager-com-user-create>
  </div>
</template>

<script setup lang="ts" name="AdminAccessUsers">
import moment from "@/utils/moment"
// 引入 hooks
import { useManagerUserBase } from "@/hooks/manager/access/user/useManagerUserBase"

// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  headerBtnsSize,
  accountsWidth,
  handlerSearch,
  handleSelectionChange,
  reqUsers,
  handlerReset,
} = useManagerUserBase()

// 获取子组件示例 用于分配角色按钮的点击事件
const assignRole = ref()
// 编辑用户
const editor = ref()
// 创建用户
const create = ref()
// 删除
const handlerDelete = (id: number) => {}
// 软删除
const handlerRemove = (id: number) => {}
onMounted(() => {})
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
