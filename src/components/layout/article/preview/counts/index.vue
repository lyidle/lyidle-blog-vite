<template>{{ looks }}次</template>

<script setup lang="ts" name="ArticleCounts">
// 引入 api
import { getArticleLook, putArticleLook } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"

const props = defineProps<{ article: GetOneArticle["data"] }>()
const looks = ref(0)

// 得到 阅读量
const articleLooks = async () => {
  const id = props.article?.id
  if (!id) return
  const result = await getArticleLook(id)
  // 赋值
  if (result) looks.value = result
}

onMounted(async () => {
  const id = props.article?.id
  if (!id) return
  try {
    // 登记 访问量
    await putArticleLook({ articleId: id })
  } catch (error) {
    console.warn("登记访问量失败~")
  }
  // 获取访问量
  await articleLooks()
})
</script>

<style scoped></style>
