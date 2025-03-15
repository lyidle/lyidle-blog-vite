<template>
  <layout-article-tree :account :title="$route.meta.title || '文章回收站'">
    <template #btns="{ row }">
      <!-- 删除 -->
      <my-popconfirm
        width="220"
        :title="`确认要恢复《${row.title}》么?`"
        icon-color="#F56C6C"
        placement="top"
        @confirm="restoreArticle"
      >
        <template #reference>
          <my-button
            class="w-80px"
            size="small"
            v-author="{ author: row.author }"
            >恢复文章</my-button
          >
        </template>
        <template #actions="{ confirm, cancel }">
          <my-button class="w-unset" type="default" size="small" @click="cancel"
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
    </template>
  </layout-article-tree>
</template>

<script setup lang="ts" name="FindAllUserPagesRestore">
// 引入 api
import { deleteArticle, searchArticleMergeExact } from "@/api/article"

// 使用 路由 hook
const route = useRoute()
// 得到作者
const account = route.params.author as string

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      author: account,
      currentPage,
      pageSize,
      restore: "true",
    })
    return result
  } catch (error) {}
}
// 删除文章的回调
const restoreArticle = async (id: string | number) => {
  try {
    // await deleteArticle(id)
    ElMessage.success(`恢复文章成功~`)
    // 获取所有文章
    await handlerArticles()
  } catch (error) {
    ElMessage.error("恢复文章失败~")
  }
}
// 提供方法
provide("req", handlerArticles)
</script>

<style scoped lang="scss"></style>
