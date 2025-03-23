<template>
  <div v-if="pagination.total" class="w-100%">
    <template v-for="item in replies" :key="item.id">
      <div>repliesId:{{ item.id }}</div>
      <div>parentId:{{ parentId }}</div>
      <div>pagination.total:{{ pagination.total }}</div>
      <layout-article-comments-item
        v-bind="$attrs"
        :comment="item"
        :parentId="props.parentId"
      ></layout-article-comments-item>
    </template>
  </div>
</template>

<script setup lang="ts" name="ArticleCommentReplyItem">
// 引入 类型
import { getCommentsReplies } from "@/api/comments"
import type { orderObjType, typeOrderMap } from "../types"
import { GetCommentsReplies } from "@/api/comments/types/getCommentsReplies"
const props = defineProps<{ parentId: number; orderMap: typeOrderMap }>()
const order = defineModel<orderObjType>("order")

// 保存的 评论
const replies = ref<GetCommentsReplies["data"]["replies"]>()
// 分页 器
const pagination = ref<GetCommentsReplies["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 1,
})

// 得到 回复的信息
const reqCommentsReplies = async () => {
  // 得到 id 判断 是否有 articleId 没有则 退出
  const id = props.parentId
  if (!id || !order.value) return
  // 获取 评论数据
  const result = await getCommentsReplies(id, {
    key: order.value.key,
    order: order.value.order,
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  // 赋值 评论数据
  const { replies: _replies, pagination: _pagination } = result
  replies.value = _replies
  pagination.value = _pagination
}

onMounted(async () => {
  await reqCommentsReplies()
})
</script>

<style scoped></style>
