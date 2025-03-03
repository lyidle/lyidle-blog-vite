<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="作者"
      :reset="handlerReset"
      placeholder="请输入作者名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
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
        <my-table-column
          width="40"
          prop="id"
          label="id"
          align="center"
          fixed="left"
        />
        <my-table-column
          :width="accountsWidth"
          prop="author"
          label="作者"
          align="center"
          fixed="left"
        />
        <my-table-column
          :width="accountsWidth"
          prop="title"
          label="标题"
          align="center"
          fixed="left"
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
        <my-table-column :width="toolBtnsWidth" label="工具栏" align="center">
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="!row.carousel ? '设置轮播和置顶' : '取消轮播和置顶'"
                placement="top"
              >
                <div class="cur-text">
                  <!-- 禁用 与 恢复 -->
                  <my-button
                    size="small"
                    :type="!row.carousel ? 'info' : 'primary'"
                    :style="{ width: isSmall ? '80px' : '30px' }"
                    @click="toggleBanner(row)"
                  >
                    <template #icon>
                      <i
                        :class="!row.carousel ? 'i-ep:top' : 'i-ep:bottom'"
                      ></i>
                    </template>
                  </my-button>
                </div>
              </el-tooltip>
              <!-- 软删除 -->
              <el-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要把《${row.title}》回收到垃圾桶么?`"
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
                :title="`确认要彻底删除《${row.title}》么?`"
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
    </my-card>
  </div>
</template>

<script setup lang="ts" name="ArticleManager">
// 引入 api
import {
  managerDeleteArticle,
  managerRemoveArticle,
  managerUpdateArticle,
} from "@/api/article"
// 引入 类型
import { Role } from "@/api/admin/types/findAllRolesPagination"
// 引入 基础配置
import { useArticleManager } from "@/hooks/manager/article/useArticleManager"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 自制moment
import moment from "@/utils/moment"
import { Article } from "@/api/article/types/getArticle"
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
  accountsWidth,
  toolBtnsWidth,
  isSmall,
} = useArticleManager(searchKey)
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
  groupIds.value = role.map((item) => item.id)
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
  // 重新加载路由
  mitt.emit("route:reload")
}

// 软删除
const handlerRemove = async (row: Role) => {
  const { id, name } = row
  try {
    // 回收到垃圾桶
    await managerRemoveArticle(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`移动${name}文章到垃圾桶成功~`)
  } catch (error) {
    ElMessage.warning(`移动${name}文章到垃圾桶失败~`)
  }
}

// 删除
const handlerDelete = async (row: Role) => {
  const { id, name } = row
  try {
    // 彻底删除
    await managerDeleteArticle(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${name}文章成功~`)
  } catch (error) {
    ElMessage.warning(`彻底删除${name}文章失败~`)
  }
}

// 批量软删除
const handlerAllRemove = async () => {
  if (!groupIds.value?.length) return ElMessage.warning("没有需要软删除的文章")
  try {
    await Promise.all(
      groupIds.value.map(async (item) => {
        try {
          // 软删除
          await managerRemoveArticle(item)
        } catch (error) {
          ElMessage.warning(`批量软删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量软删除成功,已成功移动到垃圾桶~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!groupIds.value?.length)
    return ElMessage.warning("没有需要彻底删除的文章")
  try {
    await Promise.all(
      groupIds.value.map(async (item) => {
        try {
          // 彻底删除
          await managerDeleteArticle(item)
        } catch (error) {
          ElMessage.warning(`批量彻底删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量彻底删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
  }
}

// 取消 与 设置 轮播和置顶
const toggleBanner = async (row: Article) => {
  const { id, title, carousel } = row
  try {
    // 对 carousel 取反进行设置
    await managerUpdateArticle({ id, carousel: !carousel })
    // 重新请求
    await handlerReq()
    ElMessage.success(
      `${!carousel ? "设置轮播和置顶" : "取消轮播和置顶"}${title}背景成功~`
    )
  } catch (error) {
    // 重新请求
    await handlerReq()
    ElMessage.warning(
      `${!carousel ? "设置轮播和置顶" : "取消轮播和置顶"}${title}背景失败~`
    )
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
