<template>
  <layout-article-tree
    :account
    :title="$route.meta.title || '文章回收站'"
  ></layout-article-tree>
</template>

<script setup lang="ts" name="FindAllUserPagesRestore">
// 引入 api
import { searchArticleMergeExact } from "@/api/article"

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

// 提供方法
provide("req", handlerArticles)
</script>

<style scoped lang="scss"></style>
