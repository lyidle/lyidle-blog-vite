<template>
  <div>{{ content }}</div>
</template>

<script setup lang="ts" name="UserMessageReplyContent">
import { findByPkSetting } from "@/api/admin"
import { getOneArticle } from "@/api/article"

const props = defineProps<{
  settingId: number | undefined
  articleId: number | undefined
}>()
const content = ref("")
onMounted(async () => {
  // 获取文章
  if (typeof props.articleId === "number") {
    const article = await getOneArticle(props.articleId)
    content.value = article?.content || ""
  }
  // 得到 设置的信息
  if (typeof props.settingId === "number") {
    const setting = await findByPkSetting(props.settingId)
    let con = setting?.content
    if (typeof con !== "string") con = JSON.stringify(con)
    content.value = con
  }
})
</script>

<style scoped></style>
