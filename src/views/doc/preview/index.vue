<template>
  <layout-article-preview v-model:title="title"></layout-article-preview>
</template>

<script setup lang="ts" name="Document">
// 引入 请求
import { getOneArticle } from "@/api/article"
// 解压缩
import { decompressStringNotError } from "@/utils/compression"
// 引入 mitt
import { mitt } from "@/utils/emitter"

// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
const title = ref("")
// 根据路由的params判断
const route = useRoute()
const reqArticle = async (): Promise<GetOneArticle["data"] | undefined> => {
  try {
    // 获取文章
    const articles = await getOneArticle(route.params.id as string)
    // 解压缩展示文章
    if (!articles?.content) {
      mitt.emit("NotFound", "not article")
      return
    }
    articles.content =
      (decompressStringNotError(articles.content) as string) || articles.content
    return articles
  } catch (error) {
    mitt.emit("NotFound", "not article")
  }
}
// 提供方法
provide("reqArticle", reqArticle)
</script>
