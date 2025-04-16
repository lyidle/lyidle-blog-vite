<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
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
        height="calc(70vh - 100px)"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <my-table-column type="selection" width="30" />
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="name"
          label="名字"
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
        <my-table-column
          width="100"
          fixed="right"
          label="工具栏"
          align="center"
        >
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <!-- 删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要删除敏感词分类：《${row.name}》么?`"
                placement="top"
                @confirm="handlerDelete(row)"
              >
                <template #reference>
                  <my-button class="!m-0 w-80px" size="small" type="danger"
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
        @change="reqReports"
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

<script setup lang="ts" name="AdminReportFilterGroup">
import moment from "@/utils/moment"
// 引入 hooks
import { useFilterGroupsBase } from "@/hooks/manager/filter/useFilterGroupsBase"
// 引入 接口api
import { delFilterWordGroup } from "@/api/admin/filter/group/types"
// 引入 类型
import { GetFilterWordGroups } from "@/api/admin/filter/group/types/getFilterWordGroups"
import { mitt } from "@/utils/emitter"
// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  handleSelectionChange,
  reqReports,
  reportsId,
  headerBtnsSize,
  currentPage,
  pageSize,

  tablePrimaryColumWidth,
} = useFilterGroupsBase()

// 个数变化
const handlerSizeChange = (num: number) => {
  pageSize.value = num
}

// 页数变化
const handlerCurrentPage = (num: number) => {
  currentPage.value = num
}

// 请求的逻辑
const handlerReq = async (stay?: boolean) => {
  // 当前页
  const cur = currentPage.value
  // 上一页
  const pre = cur - 1 <= 0 ? 1 : cur - 1
  if (stay) {
    // 默认是 当前页 和分页器的个数
    await reqReports(cur, pageSize.value)
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
    await reqReports(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = reportsId.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqReports(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqReports(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 删除
const handlerDelete = async (row: GetFilterWordGroups["data"]["list"][0]) => {
  const { id, name } = row
  try {
    // 删除
    await delFilterWordGroup(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`删除敏感词分类：《${name}》成功~`)
  } catch (error: any) {
    const errMsg = error?.message?.[0] as string | undefined
    if (errMsg?.includes("相关的敏感词删除完")) {
      ElMessage.error(`${errMsg},敏感词分类名：《${name}》`)
      return
    }
    ElMessage.error(`删除敏感词分类：《${name}》失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!reportsId.value?.length)
    return ElMessage.warning("没有需要删除的敏感词分类")
  try {
    await Promise.all(
      reportsId.value.map(async (item) => {
        try {
          // 删除
          await delFilterWordGroup(item)
        } catch (error: any) {
          const errMsg = error?.message?.[0] as string | undefined
          if (errMsg?.includes("相关的敏感词删除完")) {
            ElMessage.error(`${errMsg},敏感词id:${item}`)
            return
          }
          ElMessage.error(`批量删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
    ElMessage.error(`批量删除失败~`)
  }
}
</script>
