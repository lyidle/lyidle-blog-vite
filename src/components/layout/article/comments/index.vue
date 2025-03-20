<template>
  <global-animations-ribbon class="my-20px"></global-animations-ribbon>
  <div class="comments-container">
    <div class="flex items-center gap-5px">
      <span class="text-25px">评论</span>
      <span>16</span>
      <div class="flex items-center gap-3px ml-10px">
        <div class="text-15px">
          <a class="hover:color-[var(--primary-links-hover)]">最热</a>
        </div>
        <div class="text-15px">|</div>
        <div class="text-15px">
          <a class="hover:color-[var(--primary-links-hover)]">最新</a>
        </div>
      </div>
    </div>
    <!-- 增加 评论的 组件 -->
    <layout-article-comments-add
      v-if="articleId"
      :articleId
    ></layout-article-comments-add>
  </div>
</template>

<script setup lang="ts" name="ArticleComments">
// 引入 接口
import { getComments } from "@/api/comments"
// 引入 评论
import type { GetComments } from "@/api/comments/types/getComments"

const props = defineProps<{ articleId: number }>()
const counts = ref(0)
// 得到 评论
const reqComments = async () => {
  const id = props.articleId
  if (!props.articleId) return
  const result = await getComments(id)
  // 处理 评论 个数
  handlerCounts(result)
}

const handlerCounts = (comments: GetComments["data"]) => {}
onMounted(async () => {
  if (!props.articleId) return
  await reqComments()
})
</script>

<style scoped lang="scss">
.comments-container {
  padding: 0 26px;
}
</style>
