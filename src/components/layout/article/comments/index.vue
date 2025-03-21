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
      :reqComments
    ></layout-article-comments-add>
  </div>
  <div v-for="comment in comments" class="comments-content">
    <div class="comment-item">
      <div class="avatar">{{ comment.userId }}</div>
      <!-- 评论 -->
      <div class="comment">
        <!-- 渲染 文章 -->
        <vditor-preview
          :article="{ content: decompressStringNotError(comment.content) }"
          :isExportHtml="false"
          :autoPreview="true"
          v-if="comment.id"
        ></vditor-preview>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ArticleComments">
// 引入 接口
import { getComments } from "@/api/comments"
// 引入 评论
import type { GetComments } from "@/api/comments/types/getComments"
import { decompressStringNotError } from "@/utils/compression"

const props = defineProps<{ articleId: number }>()
// 评论 数量
const counts = ref(0)
const comments = ref<GetComments["data"]>()

// 得到 评论
const reqComments = async () => {
  const id = props.articleId
  if (!props.articleId) return
  const result = await getComments(id)
  // 处理 评论 个数
  handlerCounts(result)
  comments.value = result
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
%vditor-style {
  // 改变 vditor 的样式
  ::v-deep(.vditor-style) {
    padding: 10px;
    border: 1px solid var(--primary-scend-color);
    // 隐藏 描点后的 跳转
    a[id^="vditorAnchor"] {
      svg {
        display: none;
      }
    }
  }
}
// 容器的 padding
$container-pd: 0 26px;
.comments-container {
  padding: $container-pd;
  @extend %vditor-style;
}

.comments-content {
  padding: $container-pd;
  display: flex;
  gap: 10px;
  flex-direction: column;
  .comment {
    @extend %vditor-style;
  }
}
</style>
