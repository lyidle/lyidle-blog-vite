<template>
  <layout-article-review></layout-article-review>
</template>

<script setup lang="ts" name="About">
import { findOneSetting } from "@/api/admin"
const reqArticle = async () => {
  const result = await findOneSetting("关于")
  return { content: result?.content }
}
// 提供方法
provide("reqArticle", reqArticle)
</script>
