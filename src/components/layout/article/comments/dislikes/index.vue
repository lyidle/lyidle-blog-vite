<template>
  <div
    class="moment-like cur-pointer h-25px flex items-center gap-5px !hover:color-[var(--primary-links-hover)]"
    @click="toggleDislike"
    :class="isUserDislike ? 'active' : ''"
  >
    <i class="i-uiw:dislike-o w-1em h-1em"></i><span>{{ dislikeCounts }}</span>
  </div>
</template>

<script setup lang="ts" name="CommentDislikes">
// 引入 api
import { toggleCommentDislikes, getCommentDislikes } from "@/api/likeOrDislike"
// 引入 类型
import type { AddCommentLikeOrDislikeQuery } from "@/api/likeOrDislike/types/addCommentLikeOrDislikeQuery"
// 引入 处理错误的函数
import { handlerReqErr } from "@/utils/request/error/successError"

// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取数据
const { userId } = storeToRefs(useUserStore())

const props = withDefaults(
  defineProps<{
    commentId?: number
    articleId?: number
    settingId?: number
    targetUserId: number
  }>(),
  {
    commentId: undefined,
    articleId: undefined,
    settingId: undefined,
  }
)

// 点踩数
const dislikeCounts = ref(0)
// 是否 点踩
const isUserDislike = ref(false)

// 得到 点踩数量
const reqCommentDislikes = async () => {
  // 去除空的判断
  if (!validate()) return
  // 处理 点赞数量
  let result = await getCommentDislikes(props.commentId!)
  // 处理 点赞数量
  if (result?.count) dislikeCounts.value = result?.count
  // 判断是否 点赞
  const is = result?.userIds?.includes(userId.value!)
  if (is) isUserDislike.value = true
}

// dislike 的映射
const dislikeTypeMap = {
  false: "dislike",
  true: "normal",
} as const

// 判断 是否有效
const validate = (): void | boolean => {
  const id = props.articleId || props.settingId
  // 验证 信息
  if (!id) {
    console.error("操作失败，没有id")
    ElMessage.warning("操作失败，没有id")
    return
  }
  if (props.articleId && props.settingId) {
    console.error("操作失败，id冲突")
    ElMessage.warning("操作失败，id冲突")
    return
  }
  // 没有 评论id
  if (!props.commentId) return
  // 没有 userId
  if (!userId.value) return
  return true
}

// 切换 点踩
const toggleDislike = async () => {
  // 去除空的判断
  if (!validate()) return
  const is = !!isUserDislike.value
  try {
    // 切换 是否 点踩
    const dislikeType = dislikeTypeMap[`${is}`]

    // 修改 点踩 状态
    const commend: AddCommentLikeOrDislikeQuery = {
      dislikeType,
      targetUserId: props.targetUserId,
    }
    if (props.articleId) commend.articleId = props.articleId
    if (props.settingId) commend.settingId = props.settingId
    await toggleCommentDislikes(props.commentId!, commend)

    // 取反 is
    isUserDislike.value = !is
    if (dislikeType == "dislike") {
      // 自增
      dislikeCounts.value = dislikeCounts.value + 1
    }
    // 自减
    else dislikeCounts.value = dislikeCounts.value - 1 || 0
    ElMessage.success(`${is ? "取消" : ""}点踩成功`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error(`${is ? "取消" : ""}点踩失败`)
  }
}

onMounted(reqCommentDislikes)
</script>

<style scoped></style>
