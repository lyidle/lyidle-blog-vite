<template>{{ times }}</template>

<script setup lang="ts" name="ArticleTimes">
// 引入 api
import { getArticleTime, putArticleTime } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import { formatMilliseconds } from "@/utils/times/timeFormatter"

const props = defineProps<{ article: GetOneArticle["data"] }>()
const times = ref("0秒")

// 得到 阅读量
const articleLooks = async () => {
  const id = props.article?.id
  if (!id) return
  const result = await getArticleTime(id)
  // 不存在 则赋值
  if (!result) return
  // 赋值
  times.value = result
}
// 进入 的 时间
let getTime = Date.now()

onMounted(async () => {
  await articleLooks()
})
onUnmounted(async () => {
  const id = props.article?.id
  if (!id) return
  try {
    const time = formatMilliseconds(Date.now() - getTime)
    if (time.includes("分")) {
      await putArticleTime({ articleId: id, time })
    }
  } catch (error) {
    console.error("更新阅读时间失败~")
  }
})
</script>

<style scoped></style>
