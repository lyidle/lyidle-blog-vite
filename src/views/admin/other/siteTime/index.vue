<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init()"
          >添加进程</my-button
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
          prop="content"
          label="内容"
          align="center"
          :width="tablePrimaryColumWidth"
        >
          <template #="{ row }">
            <span>
              {{ row.content }}
            </span>
          </template>
        </my-table-column>
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
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '50px' }"
                type="warning"
                @click="handerEditor(row)"
                >编辑</my-button
              >

              <!-- 删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要彻底删除id为《${row.id}》的进程么?`"
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
        @change="reqSiteTimes"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-site-time-create ref="create" @req="handlerReq" />
      <manager-com-site-time-editor
        ref="editor"
        @req="handlerReq"
        v-if="editorDialogVisible"
      />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminOtherSettings">
// 引入 api
import { delSiteTimes } from "@/api/webInfo"
// 引入 类型
import { GetSiteTimes } from "@/api/webInfo/types/getSiteTimes"
// 引入 基础配置
import { useMangerSiteTimeBase } from "@/hooks/manager/other/siteTime/useMangerSiteTimeBase"

import moment from "@/utils/moment"
import { handlerReqErr } from "@/utils/request/error/successError"

// 使用 基础配置
const {
  tableData,
  pagination,
  reqSiteTimes,
  currentPage,
  pageSize,
  tablePrimaryColumWidth,

  headerBtnsSize,
  toolBtnsWidth,
  isSmall,
} = useMangerSiteTimeBase()
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
const handleSelectionChange = (role: GetSiteTimes["data"]["list"][0][]) => {
  roleIds.value = role.map((item) => item.id)
}

// 子组件实例
const create = ref()
const editor = ref()
const editorDialogVisible = ref(false)
const handerEditor = (row: GetSiteTimes["data"]["list"][0]) => {
  editorDialogVisible.value = true
  nextTick(() => editor.value.init(row))
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
    await reqSiteTimes(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = roleIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqSiteTimes(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqSiteTimes(cur, pageSize.value)
}

// 删除
const handlerDelete = async (row: GetSiteTimes["data"]["list"][0]) => {
  const { id } = row
  try {
    // 彻底删除
    await delSiteTimes(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除id为:${id}的进程成功~`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error(`彻底删除id为:${id}的进程失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!roleIds.value?.length) return ElMessage.warning("没有需要彻底删除的进程")
  const results = await Promise.allSettled(
    roleIds.value.map((item) => delSiteTimes(item))
  )
  const sucArr: any[] = []
  // @ts-ignore
  const rejectArr = results
    .map((item) => {
      if (item.status === "fulfilled") sucArr.push(item)
      return item.status === "rejected" && item.reason?.message
    })
    .filter(Boolean)
    .flat(Infinity)

  if (rejectArr.length) {
    const err = handlerReqErr({ message: rejectArr }, "error")
    if (!err) ElMessage.error("批量删除进程项失败")
  } else {
    ElMessage.success("批量删除进程项成功")
  }
  if (sucArr.length && rejectArr.length) {
    ElMessage.error("部分进程项删除失败")
  }

  // 重新请求
  if (pagination.value?.total === 1) await reqSiteTimes()
  else await handlerReq()
}
</script>
