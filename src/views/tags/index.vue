<template>
  <layout-article-tree
    :title="`${$route.meta.title || '标签'}：${handlerTitle()} `"
    :isTools="false"
    v-if="isShow"
  ></layout-article-tree>
</template>

<script setup lang="ts" name="SearchTags">
// 引入 api
import { searchArticleMergeExact } from "@/api/article"

// 使用 路由 hook
const route = useRoute()

// 处理标题
const handlerTitle = () => {
  if (typeof tags === "string") return tags
  return tags.join(" · ")
}

const isShow = ref(true)

// 得到分类
let tags: string | string[] = ""
const initTags = () => {
  try {
    tags = JSON.parse(route.query.tags as string)
  } catch (error) {
    tags = [route.query.tags as string]
  }
}
initTags()

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      tags: typeof tags === "string" ? tags : JSON.stringify(tags),
      currentPage,
      pageSize,
    })
    return result
  } catch (error) {}
}
watch(
  () => route.query.tags,
  (cur, pre) => {
    if (cur !== pre) {
      isShow.value = false
      initTags()
      nextTick(() => (isShow.value = true))
    }
  }
)
// 提供方法
provide("req", handlerArticles)
</script>

<style scoped lang="scss"></style>
