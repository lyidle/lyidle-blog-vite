<template>
  <div v-if="pagination.total" class="w-100%">
    <div>
      <template v-for="item in replies" :key="item.id">
        <layout-article-comments-item
          v-bind="$attrs"
          :comment="item"
          :parentId="props.parentId"
          class="mt-20px"
        >
          <template #comment-outer>
            <template v-if="isShowMore">
              <div class="cur-text mt-5px" v-if="pagination.total > 1">
                共<span class="mx-5px">{{ pagination.total }} </span>
                条回复，<span
                  class="cur-pointer !hover:color-[var(--primary-links-hover)]"
                  @click="viewComments"
                  >点击查看</span
                >
              </div>
            </template>
          </template>
        </layout-article-comments-item>
      </template>
    </div>
    <my-pagination-text
      v-if="pagination.total && !isShowMore"
      layout="prev, pager, next"
      :total="pagination.total"
      class="ml-[var(--normal-avatar-size)]"
      @change="handlerChange"
    />
  </div>
</template>

<script setup lang="ts" name="ArticleCommentReplyItem">
// 引入 api
import { getCommentsReplies } from "@/api/comments"
// 引入 类型
import type { orderObjType, typeOrderMap } from "../types"
import type { GetCommentsReplies } from "@/api/comments/types/getCommentsReplies"
// 接收父组件数据
const props = defineProps<{ parentId: number; orderMap: typeOrderMap }>()
const order = defineModel<orderObjType>("order")
// 触发自定义事件
const emit = defineEmits<{
  (e: "counts", num: number): void
}>()

// 分页器的 大小
const NORMAL_PAGESIZE = 10
// 保存的 评论
const replies = ref<GetCommentsReplies["data"]["replies"]>()
// 分页 器
const pagination = ref<GetCommentsReplies["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 1,
})

// 是否 显示 查看更多评论
const isShowMore = ref(true)

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
  emit("counts", _pagination.total!)
}

// 分页器 回调
const handlerChange = async (currentPage: number, pageSize: number) => {
  if (currentPage) pagination.value.currentPage = currentPage
  if (pageSize) pagination.value.pageSize = pageSize
  // 请求 回复信息
  await reqCommentsReplies()
}

// 查看 更多评论回调
const viewComments = async () => {
  // 关闭 显示 查看更多评论
  isShowMore.value = false
  // 设置 pagination 属性
  pagination.value.pageSize = NORMAL_PAGESIZE
  // 重新 获取数据
  await reqCommentsReplies()
}
defineExpose({ reqCommentsReplies })
</script>

<style scoped></style>
