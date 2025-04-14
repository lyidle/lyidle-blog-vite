<template>
  <span v-if="!errLooks"> {{ looks }}次 </span>
  <span v-else>
    {{ errLooks }}
  </span>
</template>

<script setup lang="ts" name="ArticleCounts">
// 引入 api
import { getArticleLook, putArticleLook } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"

const props = defineProps<{ article: GetOneArticle["data"] }>()
const looks = ref<string>("0")
const errLooks = ref<string>()

// 得到 阅读量
const articleLooks = async () => {
  const id = props.article?.id
  try {
    if (!id) return
    const result = await getArticleLook(id)
    // 赋值
    if (result) looks.value = result
  } catch (error) {
    errLooks.value = "获取失败"
    console.warn("获取阅读量失败")
  }
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
