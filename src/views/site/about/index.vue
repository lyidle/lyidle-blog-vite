<template>
  <layout-article-preview
    v-model:title="title"
    :isShowHeader="false"
    :isArticle="false"
    v-model:settingId="settingId"
  ></layout-article-preview>
</template>

<script setup lang="ts" name="About">
import { findOneSetting } from "@/api/admin"
import { decompressStringNotError } from "@/utils/compression"

const settingId = ref<number | null>(null)
const reqArticle = async () => {
  settingId.value = null
  const result = await findOneSetting("关于")
  let content = decompressStringNotError(result?.content as string)
  settingId.value = result?.id || null
  return { content, userId: result?.userId }
}
const title = ref("关于")
// 提供方法
provide("reqArticle", reqArticle)
</script>
