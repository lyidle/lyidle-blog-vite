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
        <el-table-column width="245" label="工具栏" align="center">
          <template #="{ row }">
            <my-button size="small" class="w-80px" @click="AssignRoles(row)"
              >分配角色</my-button
            >
            <my-button size="small" class="w-50px" type="warning"
              >编辑</my-button
            >
            <my-button size="small" class="w-50px" type="danger"
              >删除</my-button
            >
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

    <my-drawer
      v-model="drawer"
      width="250px"
      @close="handlerClose"
      name="mini-header-drawer"
    >
      <template #body>
        <div class="text-[20px]">分配角色</div>
        <el-form class="mt-20px">
          <el-form-item class="!mb-10px" label="用户姓名">
            <my-input placeholder="用户姓名"></my-input>
          </el-form-item>
          <el-form-item class="!mb-10px" label="用户列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              Check all
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in cities"
                :key="city"
                :label="city"
                :value="city"
              >
                {{ city }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </my-drawer>
  </div>
</template>

<script setup lang="ts" name="AdminAccessUsers">
import { searchExactUser } from "@/api/user"
import type { searchData } from "@/api/user/types/searchUserPagination"
import { mitt } from "@/utils/emitter"
import moment from "@/utils/moment"

// 抽屉
const drawer = ref(true)
const handlerClose = () => {}

import type { CheckboxValueType } from "element-plus"

const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref(["Shanghai", "Beijing"])
const cities = ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"]

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}

const AssignRoles = (row: any) => {
  console.log(row)
}

// 表格
const tableData = ref<searchData["users"]>([])
// 分页器
const pagination = ref<searchData["pagination"]>()

// 头部 搜索 按钮大小
const headerBtnsSize = ref("default")
// 账号和用户名的 宽度
const accountsWidth = ref(130)

// 搜索回调
const handlerSearch = (key: string) => {
  ElMessage(key)
}

// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    // 账号和用户名的 宽度
    accountsWidth.value = 130
    headerBtnsSize.value = "default"
    return
  }
  // 账号和用户名的 宽度
  accountsWidth.value = 70
  headerBtnsSize.value = "small"
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

// 选中的 userId
const userIds = ref<number[]>([])
// 处理 多选框 变化问题
const handleSelectionChange = (user: searchData["users"]) => {
  // 得到 选张的user的id
  userIds.value = user.map((item) => item.id)
}

// pagination  的回调
// 获取用户
const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
  try {
    const result = await searchExactUser({ currentPage, pageSize })
    tableData.value = result?.users || []
    pagination.value = result?.pagination
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
