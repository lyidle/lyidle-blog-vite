<template>
  <global-tree v-model="listData">
    <template #title> </template>
    <template #list="{ list }"> </template>
  </global-tree>
</template>

<script setup lang="ts" name="Time">
// 引入 api
import { searchArticleMergeExact } from "@/api/article"

const listData = ref()

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      currentPage,
      pageSize,
    })
    const handler = {
      list: result.article,
      pagination: result.pagination,
    }
    listData.value = handler
    return handler
  } catch (error) {}
}

onMounted(handlerArticles)
// 提供方法
provide("req", handlerArticles)
</script>
