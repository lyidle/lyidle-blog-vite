<template>
  <layout-article-review></layout-article-review>
</template>

<script setup lang="ts" name="About">
import { findOneSetting } from "@/api/admin"
import { decompressStringNotError } from "@/utils/compression"
const reqArticle = async () => {
  const result = await findOneSetting("关于")
  let content = decompressStringNotError(result?.content as string)
  return { content }
}
// 提供方法
provide("reqArticle", reqArticle)
</script>
