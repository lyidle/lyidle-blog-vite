<template>
  <layout-article-review></layout-article-review>
</template>

<script setup lang="ts" name="About">
import about from "./about.md?raw"
const reqArticle = async () => {
  return { content: about }
}

// 提供方法
provide("reqArticle", reqArticle)
</script>
