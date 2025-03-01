<template>
  <layout-article-tree
    :account
    :title="`标签：《${handlerTitle()}》总览`"
  ></layout-article-tree>
</template>

<script setup lang="ts" name="UserTags">
// 引入 api
import { searchArticleMergeExact } from "@/api/article"

// 使用 路由 hook
const route = useRoute()
// 得到作者
const account = route.query.author as string

// 处理标题
const handlerTitle = () => {
  console.log(tags)
  if (typeof tags === "string") return tags

  return tags.join(" · ")
}

// 得到分类
let tags: string | string[] = ""
try {
  tags = JSON.parse(route.query.tags as string)
} catch (error) {
  tags = [route.query.tags as string]
}
// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      author: account,
      tags: typeof tags === "string" ? tags : JSON.stringify(tags),
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
