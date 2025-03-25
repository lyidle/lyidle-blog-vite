<template>
  <layout-article-review
    v-model:title="title"
    :isShowHeader="false"
    :isArticle="false"
    v-model:settingId="settingId"
  ></layout-article-review>
</template>

<script setup lang="ts" name="About">
import { findOneSetting } from "@/api/admin"
import { decompressStringNotError } from "@/utils/compression"

const settingId = ref(-1)
const reqArticle = async () => {
  settingId.value = -1
  const result = await findOneSetting("关于")
  let content = decompressStringNotError(result?.content as string)
  settingId.value = result?.id || -1
  return { content }
}
const title = ref("关于")
// 提供方法
provide("reqArticle", reqArticle)
</script>
