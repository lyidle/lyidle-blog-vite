<template>
  <div class="admin-container">
    <my-card
      class="admin-content card_style !overflow-unset flex gap-15px"
      bg="var(--manager-card-bg) "
    >
      <div class="flex gap-10px items-center">
        <span class="cur-text">举报的类型:</span>
        <my-select
          v-model="types"
          :options="typeOptions"
          @change="reloadReq"
          class="w-100px"
        ></my-select>
      </div>
    </my-card>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init(types, typeOptions)"
          >添加敏感词</my-button
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
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column prop="word" label="敏感词" align="center" />
        <my-table-column prop="type" label="分类" align="center" />
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
                :title="`确认要删除敏感词:《${row.word}》么?`"
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
        @change="reqFilterWOrds"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        :dark="true"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />
      <manager-com-filter-create
        ref="create"
        @req="handlerReq"
      ></manager-com-filter-create>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminReportFilterWords">
import moment from "@/utils/moment"
// 引入 hooks
import { useFilterWordsBase } from "@/hooks/manager/filter/useFilterWordsBase"
// 引入 接口api
import { delFilterWord } from "@/api/admin/filter"
// 引入 类型
import { GetFilterWords } from "@/api/admin/filter/types/getFilterWords"
import { mitt } from "@/utils/emitter"
// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  handleSelectionChange,
  reqFilterWOrds,
  reportsId,
  headerBtnsSize,
  currentPage,
  pageSize,

  // 多选框
  types,
  typeOptions,
} = useFilterWordsBase()

// 子组件
const create = ref()

// 多选框变化时
const reloadReq = async () => {
  currentPage.value = 0
  await reqFilterWOrds()
}

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
    await reqFilterWOrds(cur, pageSize.value)
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
    await reqFilterWOrds(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = reportsId.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqFilterWOrds(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqFilterWOrds(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 删除
const handlerDelete = async (row: GetFilterWords["data"]["list"][0]) => {
  const { id, word } = row
  try {
    // 删除
    await delFilterWord(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`删除敏感词：《${word}》成功~`)
  } catch (error) {
    ElMessage.error(`删除敏感词：《${word}》失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!reportsId.value?.length) return ElMessage.warning("没有需要删除的敏感词")
  try {
    await Promise.all(
      reportsId.value.map(async (item) => {
        try {
          // 删除
          await delFilterWord(item)
        } catch (error) {
          ElMessage.error(`批量删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    if (pagination.value?.total === 1) await reqFilterWOrds()
    else await handlerReq()
    ElMessage.success(`批量删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    if (pagination.value?.total === 1) await reqFilterWOrds()
    else await handlerReq()
    ElMessage.error(`批量删除失败~`)
  }
}
</script>
