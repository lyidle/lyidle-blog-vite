<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="背景"
      :reset="handlerReset"
      placeholder="请输入背景名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
      >
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
        <el-table-column label="工具栏" align="center">
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <my-button
                size="small"
                class="!m-0 w-50px"
                type="warning"
                @click="editor.init(row)"
                >编辑</my-button
              >

              <!-- 禁用 与 恢复 -->
              <my-button
                class="!m-0 w-30px"
                size="small"
                :type="row.isBin ? 'info' : 'primary'"
                @click="toggleBanner(row)"
              >
                <template #icon>
                  <i :class="row.isBin ? 'i-ep:top' : 'i-ep:bottom'"></i>
                </template>
              </my-button>
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
        @change="reqAllGroups"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        :default-current-page="currentPage"
        :default-page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-banner-editor ref="editor" @req="handlerReq" />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessGroups">
// 引入 api
import { managerRecycleBannerImg, managerRestoreBannerImg } from "@/api/admin"
// 引入 类型
import { Banner } from "@/api/admin/types/getBannerImgPagination"
// 引入 基础配置
import { useMangerBannerBase } from "@/hooks/manager/other/banner/useMangerBannerBase"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 自制moment
import moment from "@/utils/moment"
// 搜索 的key
const searchKey = ref("")
// 使用 基础配置
const {
  handlerSearch,
  tableData,
  pagination,
  reqAllGroups,
  handlerReset,

  accountsWidth,
} = useMangerBannerBase(searchKey)
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

// 子组件实例
const editor = ref()
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
    await reqAllGroups(pre, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqAllGroups(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 禁用 与 恢复
const toggleBanner = async (row: Banner) => {
  const { id, name, isBin } = row
  try {
    if (isBin) {
      // 恢复 背景
      await managerRestoreBannerImg(id)
    } else {
      // 禁用 背景
      await managerRecycleBannerImg(id)
    }
    // 重新请求
    await handlerReq()
    ElMessage.success(`${isBin ? "恢复" : "禁用"}${name}背景成功~`)
  } catch (error) {
    ElMessage.warning(`${isBin ? "恢复" : "禁用"}${name}背景失败~`)
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
