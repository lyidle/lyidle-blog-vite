<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="路径"
      :reset="handlerReset"
      placeholder="请输入路径名"
    >
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <my-table
        :data="tableData"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
      >
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column
          width="200"
          prop="name"
          label="路径名"
          align="center"
        />
        <my-table-column
          min-width="130px"
          prop="light"
          label="白天背景"
          align="center"
        >
          <template #="{ row }">
            <div
              :style="{
                background: 'no-repeat center',
                backgroundSize: 'cover',
                backgroundImage: row.light
                  ? `var(--banner-mask) , url('${escapeUrlForRegExp(
                      row.light
                    )}')`
                  : `var(--banner-mask) , url('${default_light}')`,
              }"
              alt=""
              class="avatar w-100px h-100px block m-auto"
            />
          </template>
        </my-table-column>
        <my-table-column
          min-width="130px"
          prop="dark"
          label="暗夜背景"
          align="center"
        >
          <template #="{ row }">
            <div
              :style="{
                background: 'no-repeat center',
                backgroundSize: 'cover',
                backgroundImage: row.dark
                  ? `var(--banner-mask) , url('${escapeUrlForRegExp(
                      row.dark
                    )}')`
                  : `var(--banner-mask) , url('${default_dark}')`,
              }"
              alt=""
              class="avatar w-100px h-100px block m-auto"
            />
          </template>
        </my-table-column>
        <!-- 工具栏 -->
        <my-table-column
          width="130"
          fixed="right"
          label="工具栏"
          align="center"
        >
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <my-button
                size="small"
                class="!m-0 w-50px"
                type="warning"
                @click="editor.init(row)"
                >编辑</my-button
              >
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="row.isBin ? '恢复' : '禁用'"
                placement="top"
              >
                <div class="cur-text">
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
              </my-tooltip>
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
        @change="reqAllBanners"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-banner-editor ref="editor" @req="handlerReq" />
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminOtherBanner">
// 引入 api
import { managerRecycleBannerImg, managerRestoreBannerImg } from "@/api/admin"
// 引入 类型
import { Banner } from "@/api/admin/types/getBannerImgPagination"
// 引入 基础配置
import { useMangerBannerBase } from "@/hooks/manager/other/banner/useMangerBannerBase"
// url转义
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"

// 引入 默认banner 图片
// 导入 默认的图片
const default_light =
  "https://blog-api.lyidle.cn/images/public/base-bg-light.png"
const default_dark = "https://blog-api.lyidle.cn/images/public/base-bg-dark.png"

// 搜索 的key
const searchKey = ref("")
// 使用 基础配置
const {
  handlerSearch,
  tableData,
  pagination,
  reqAllBanners,
  handlerReset,
  currentPage,
  pageSize,
} = useMangerBannerBase(searchKey)

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
const handlerReq = async (stay?: boolean) => {
  // 当前页
  const cur = currentPage.value
  // 上一页
  const pre = cur - 1 <= 0 ? 1 : cur - 1

  if (stay) {
    // 默认是 当前页 和分页器的个数
    await reqAllBanners(cur, pageSize.value)
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
    await reqAllBanners(pre, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqAllBanners(cur, pageSize.value)
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
    await handlerReq(true)
    ElMessage.success(`${isBin ? "恢复" : "禁用"}${name}背景成功~`)
  } catch (error) {
    // 重新请求
    await handlerReq(true)
    ElMessage.error(`${isBin ? "恢复" : "禁用"}${name}背景失败~`)
  }
}
</script>
