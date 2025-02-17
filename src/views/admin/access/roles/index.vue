<template>
  <div class="admin-container">
    <my-search-admin :submit="handlerSearch"> </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >添加角色</my-button
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
          width="150"
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
        <el-table-column width="295" label="工具栏" align="center">
          <template #="{ row }">
            <my-button size="small" class="w-80px">分配权限</my-button>
            <my-button size="small" class="w-50px" type="warning"
              >编辑</my-button
            >

            <!-- 软删除 -->
            <el-popconfirm
              width="220"
              icon-color="#F56C6C"
              :title="`确认要把《${row.name}》回收到垃圾桶么?`"
              placement="top"
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
              :title="`确认要彻底删除《${row.name}》么?`"
              placement="top"
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
        @change="reqAllRoles"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        :default-current-page="currentPage"
        :default-page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessRoles">
// 引入 基础配置
import { useMangerRolesBase } from "@/hooks/manager/access/roles/useMangerRolesBase"
// 引入 自制moment
import moment from "@/utils/moment"
// 使用 基础配置
const {
  handlerSearch,
  headerBtnsSize,
  tableData,
  pagination,
  currentPage,
  pageSize,
  handlerSizeChange,
  handlerCurrentPage,
  handleSelectionChange,
  reqAllRoles,
} = useMangerRolesBase()
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
