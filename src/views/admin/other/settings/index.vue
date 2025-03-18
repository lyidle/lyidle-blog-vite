<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="设置名"
      :reset="handlerReset"
      placeholder="设置名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="create.init()"
          >添加设置</my-button
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
          :width="accountsWidth"
          prop="name"
          label="设置名"
          align="center"
        />
        <my-table-column prop="content" label="内容" align="center">
          <template #="{ row }">
            <!-- 不是数组 -->
            <div v-if="!Array.isArray(row.content)" class="cur-text">
              {{ row.content }}
            </div>
            <!-- 是数组 -->
            <template v-else>
              <el-tag
                v-for="(arr, i) in row.content"
                :key="arr"
                :type="tagsType[i % tagsType.length]"
                class="cur-text ml-10px float-left"
                >{{ arr }}</el-tag
              >
            </template>
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
        @change="reqAllSettings"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-setting-create ref="create" @req="handlerReq" />
      <manager-com-setting-editor
        ref="editor"
        @req="handlerReq"
        v-if="editorDialogVisible"
      />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminOtherSettings">
// 引入 api
import { managerDeleteSetting } from "@/api/admin"
// 引入 类型
import type { Setting } from "@/api/admin/types/findAllSettingsPagination"
import { tagsType } from "@/components/my/tags"
// 引入 基础配置
import { useMangerSettingsBase } from "@/hooks/manager/other/settings/useMangerSettingsBase"
// 搜索 的key
const searchKey = ref("")
// 使用 基础配置
const {
  handlerSearch,
  tableData,
  pagination,
  reqAllSettings,
  handlerReset,
  currentPage,
  pageSize,

  headerBtnsSize,
  accountsWidth,
  toolBtnsWidth,
  isSmall,
} = useMangerSettingsBase(searchKey)
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
const handleSelectionChange = (role: Setting[]) => {
  roleIds.value = role.map((item) => item.id)
}

// 子组件实例
const create = ref()
const editor = ref()
const editorDialogVisible = ref(false)
const handerEditor = (row: Setting) => {
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
  const pre = cur - 1 || 1
  // 只有一个的情况
  if (tableData.value.length === 1) {
    // 跳到上一页
    await reqAllSettings(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = roleIds.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqAllSettings(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqAllSettings(cur, pageSize.value)
}

// 删除
const handlerDelete = async (row: Setting) => {
  const { id, name } = row
  try {
    // 彻底删除
    await managerDeleteSetting(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`彻底删除${name}设置成功~`)
  } catch (error) {
    ElMessage.error(`彻底删除${name}设置失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!roleIds.value?.length) return ElMessage.warning("没有需要彻底删除的设置")
  try {
    await Promise.all(
      roleIds.value.map(async (item) => {
        try {
          // 彻底删除
          await managerDeleteSetting(item)
        } catch (error) {
          ElMessage.error(`批量彻底删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    await handlerReq()
    ElMessage.success(`批量彻底删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    await handlerReq()
    ElMessage.error(`批量彻底删除失败~`)
  }
}
</script>
