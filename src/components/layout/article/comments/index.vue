<template>
  <global-animations-ribbon class="my-20px"></global-animations-ribbon>
  <div class="comments-container">
    <div class="flex items-center gap-5px">
      <span class="text-25px">评论</span>
      <span>{{ +counts }}</span>
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
// 评论 数量
const counts = ref(0)

// 得到 评论
const reqComments = async () => {
  const id = props.articleId
  if (!props.articleId) return
  const result = await getComments(id)
  // 处理 评论 个数
  handlerCounts(result)
}

// 处理 评论数量的 函数
const handlerCounts = (comments: GetComments["data"]) => {
  // 初始化 外层的 个数
  let len = comments?.length || 0
  if (len) {
    // 初始化回复的 个数
    for (const value of comments) {
      const curLen = value.replies?.length
      // 存在 则相加
      if (curLen) len += curLen
    }
  }
  if (len) counts.value = len
}
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
