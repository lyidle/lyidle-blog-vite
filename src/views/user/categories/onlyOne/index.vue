<template>
  <layout-article-tree
    :account
    :title="`分类：${category} `"
  ></layout-article-tree>
</template>

<script setup lang="ts" name="UserCategory">
// 引入 api
import { searchArticleMergeExact } from "@/api/article"

// 使用 路由 hook
const route = useRoute()
// 得到作者
const account = route.query.author as string
// 得到分类
const category = route.query.category as string

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      author: account,
      category,
      currentPage,
      pageSize,
    })
    return result
  } catch (error) {}
}

// 提供方法
provide("req", handlerArticles)
</script>

<style scoped lang="scss"></style>
