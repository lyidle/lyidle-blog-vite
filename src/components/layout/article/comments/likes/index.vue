<template>
  <div
    class="moment-like cur-pointer h-25px flex items-center gap-5px !hover:color-[var(--primary-links-hover)]"
    :class="isUserLike ? 'active' : ''"
    @click="toggleLike"
  >
    <i class="i-uiw:like-o w-1em h-1em"></i><span>{{ likeCounts }}</span>
  </div>
</template>

<script setup lang="ts" name="CommentLikes">
// 引入 api
import { getCommentLikes, toggleCommentLikes } from "@/api/likeOrDislike"
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

// 点赞数
const likeCounts = ref(0)
// 是否 点赞
const isUserLike = ref(false)

// 得到 点赞数量
const reqCommentLikes = async () => {
  // 去除空的判断
  if (!validate()) return
  // 处理 点赞数量
  let result = await getCommentLikes(props.commentId!)
  if (result?.count) likeCounts.value = result?.count
  // 判断是否 点赞
  const is = result?.userIds?.includes(userId.value!)
  if (is) isUserLike.value = true
}

// like 的映射
const likeTypeMap = {
  false: "like",
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

// 切换 点赞
const toggleLike = async () => {
  // 去除空的判断
  if (!validate()) return
  const is = !!isUserLike.value
  try {
    // 切换 是否点赞
    const likeType = likeTypeMap[`${is}`]

    // 修改 点赞 状态
    const commend: AddCommentLikeOrDislikeQuery = {
      likeType,
      targetUserId: props.targetUserId,
    }
    if (props.articleId) commend.articleId = props.articleId
    if (props.settingId) commend.settingId = props.settingId
    await toggleCommentLikes(props.commentId!, commend)

    // 取反 is
    isUserLike.value = !is
    if (likeType == "like") {
      // 自增
      likeCounts.value = likeCounts.value + 1
    }
    // 自减
    else likeCounts.value = likeCounts.value - 1 || 0
    ElMessage.success(`${is ? "取消" : ""}点赞成功`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error(`${is ? "取消" : ""}点赞失败`)
  }
}

onMounted(reqCommentLikes)
</script>

<style scoped></style>
