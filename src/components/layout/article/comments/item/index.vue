<template>
  <div class="comment-item-container">
    <!-- 头像和评论 -->
    <div class="flex justify-between relative">
      <!-- 头像 -->
      <global-avatar-src
        :account="comment.user.account"
        :avatar="comment.user.avatar"
        :style="{ '--avatar-size': avatarSize }"
      ></global-avatar-src>
      <div
        class="w-100% h-100% ml-[var(--primary-pd)] gap-[var(--primary-gap)] flex flex-col"
      >
        <div class="flex gap-10px cur-text">
          <div class="userName font-bold">
            {{ comment.user.nickName }}
          </div>
          <div class="flex gap-8px" v-if="comment.fromId">
            <div>回复</div>
            <div class="global-at">
              @<span>{{ comment.replies.user.nickName }}</span>
            </div>
            <div>:</div>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment-data w-100% h-100%">
          <!-- 渲染 评论 -->
          <vditor-preview
            :article="{
              content: decompressStringNotError(comment.content),
            }"
            :isExportHtml="false"
            :autoPreview="true"
            v-if="comment.id"
            v-show="!isEditor"
          ></vditor-preview>
          <layout-article-comments-base v-show="isEditor" ref="editorInstance">
          </layout-article-comments-base>
        </div>
      </div>
      <!-- more -->
      <div class="comment-more absolute right-[var(--primary-gap)] top-0">
        <global-header-item v-model:data="moreItem" top="5px" menu="test">
          <i
            class="i-ri:more-line w-1em h-1em cur-pointer !hover:color-[var(--primary-links-hover)]"
          ></i>
          <template #custom="{ item: sub }: { item: menuItemType }">
            <my-menu-item v-if="hasEditor(sub)">
              <my-anchor
                :to="sub.to"
                class="topnav-menu-item"
                :style="{ width: moreItem.style?.width }"
                @click="sub?.click?.()"
              >
                <i :class="sub?.icon?.icon" :style="sub?.icon?.style"></i>
                <span>{{ sub.name }}</span>
              </my-anchor>
            </my-menu-item>
          </template>
        </global-header-item>
      </div>
    </div>
    <!-- 评论下方的 用户、点赞等信息 与按钮 -->
    <div class="mt-[var(--primary-gap)] pl-65px flex justify-between">
      <!-- 操作按钮 -->
      <div class="flex gap-20px">
        <!-- 更新时间 -->
        <div class="h-25px flex items-center gap-5px">
          {{ moment(comment.updatedAt, "YYYY-MM-DD hh:mm") }}
        </div>
        <!-- 点赞 -->
        <div
          class="moment-like cur-pointer h-25px flex items-center gap-5px !hover:color-[var(--primary-links-hover)]"
          :class="isUserLike ? 'active' : ''"
          @click="toggleLike"
        >
          <i class="i-uiw:like-o w-1em h-1em"></i>{{ likeCounts }}
        </div>
        <!-- 点踩 -->
        <div
          class="moment-like cur-pointer h-25px flex items-center gap-5px !hover:color-[var(--primary-links-hover)]"
          @click="toggleDislike"
          :class="isUserDislike ? 'active' : ''"
        >
          <i class="i-uiw:dislike-o w-1em h-1em"></i>{{ dislikeCounts }}
        </div>
        <!-- 回复 -->
        <!-- 看 b站 可以自己给自己回复 所以也没有限制 -->
        <!-- v-if="comment.user.account !== userAccount" -->
        <!-- 触发自定义事件 -->
        <div
          class="h-25px flex items-center gap-5px cur-pointer [var(--primary-links-hover)]"
          @click="
            emit('reply', {
              showId: parentId || comment.id,
              fromId: comment.id,
              fromNickName: comment.user.nickName,
            })
          "
        >
          <span class="!hover:color-[var(--primary-links-hover)]">回复</span>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="cur-text flex gap-[var(--primary-gap)]">
        <div class="h-25px flex items-center gap-5px">
          <i class="i-jam:gps w-1em h-1em"></i>
          {{ comment.user.userProvince }}
        </div>
        <div class="h-25px flex items-center gap-5px">
          <i class="i-icon-park-outline:system w-1em h-1em"></i
          >{{ comment.user.userAgent?.split("|")[0].trim() || "未知系统版本" }}
        </div>
        <div class="h-25px flex items-center gap-5px">
          <i class="i-arcticons:styxbrowser w-1em h-1em"></i>
          {{ comment.user.userAgent?.split("|")[1].trim() || "未知浏览器版本" }}
        </div>
      </div>
    </div>
    <div class="pl-65px">
      <slot name="comment-outer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="ArticleCommentsItem">
// 引入 api
import {
  // #region 文章的评论
  getArticleCommentLikes,
  getArticleCommentDislikes,
  articleToggleCommentLikes,
  articleToggleCommentDislikes,
  // #endregion 文章的评论
  // #region 设置的评论
  getSettingCommentLikes,
  getSettingCommentDislikes,
  settingToggleCommentLikes,
  settingToggleCommentDislikes,
  // #endregion 设置的评论
} from "@/api/likeOrDislike"
// 引入 类型
import type { GetComments } from "@/api/comments/types/getComments"
import type { GetCommentsReplies } from "@/api/comments/types/getCommentsReplies"
import type { handlerReplyType } from "../types"
import type { menuItemType, menuView } from "@/components/layout/header/types"
import type { LikeOrDislikeCounts } from "@/api/likeOrDislike/types/likeOrDislikeCounts"
// 引入 解压 函数
import { decompressStringNotError } from "@/utils/compression"
// 引入 moment
import moment from "@/utils/moment"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { handlerReqErr } from "@/utils/request/error/successError"

const { userAccount, userToken, userId } = storeToRefs(useUserStore())
// 是否修改
const isEditor = ref(false)
const editorInstance = ref()
// 重新赋值
const initContext = () =>
  editorInstance.value.clearSetValue(
    decompressStringNotError(props.comment.content)
  )

const props = withDefaults(
  defineProps<{
    comment:
      | GetCommentsReplies["data"]["replies"][0]
      | GetComments["data"]["comments"][0]["replies"][0]
    author?: string
    parentId: number | null
    avatarSize?: string
    articleId?: number
    settingId?: number
  }>(),
  {
    avatarSize: "50px",
  }
)

// 评论的 id
const commentId = props.comment.id
// 点赞数
const likeCounts = ref(0)
// 点踩数
const dislikeCounts = ref(0)
// 是否 点赞
const isUserLike = ref(false)
// 是否 点踩
const isUserDislike = ref(false)

// 触发自定义事件
const emit = defineEmits<{
  (e: "reply", options: handlerReplyType): void
}>()

// 更多按钮 的 信息
const moreItem = computed(() => {
  return {
    data: [
      {
        id: 1,
        name: "设为置顶",
        click: async () => {
          // 置顶的 逻辑
        },
        // 是文字的 所有者
        hide: userAccount.value !== props.author,
      },
      {
        id: 2,
        name: "举报",
        click: async () => {
          // 举报的 逻辑
        },
        // 登录了的 用户
        hide: !userToken.value,
      },
      {
        id: 3,
        name: !isEditor.value ? "修改" : "取消修改",
        click: async () => {
          isEditor.value = !isEditor.value
          initContext()
          // 修改的 逻辑
        },
        // 需要 是本人的评论
      },
      {
        id: 4,
        name: "删除",
        click: async () => {
          // 删除的 逻辑
        },
        // 需要 是本人的评论 或者 作者
      },
    ],
    style: {
      width: "100px",
      pl: "20px",
    },
  } as menuView
})

// 是否 显示 编辑等按钮
const hasEditor = (sub: menuItemType) => {
  if (sub.hide) return false

  // 处理 删除按钮
  if (sub.name === "删除") {
    // 是作者本人 显示
    if (props.author === userAccount.value) return true
    // 是评论所有者 显示
    if (props.comment.user.account === userAccount.value) return true
    return false
  }

  // 处理 修改的 按钮
  if (sub.name === "修改") {
    // 是评论所有者 显示
    if (props.comment.user.account === userAccount.value) return true
    return false
  }

  // 其他的 是显示
  return true
}

// 得到 点赞数量
const reqCommentLikes = async () => {
  // 没有 评论id
  if (!commentId) return
  // 判断是文章 还是 设置
  const isArticle = validate()
  // 去除空的判断
  if (!isArticle) return
  // 处理 点赞数量
  let result: null | LikeOrDislikeCounts["data"] = null
  if (isArticle === "文章") result = await getArticleCommentLikes(commentId)
  if (isArticle === "设置") result = await getSettingCommentLikes(commentId)
  if (!result) return

  if (result?.count) likeCounts.value = result?.count
  // 判断是否 点赞
  const is = result?.userIds?.includes(userId.value)
  if (is) isUserLike.value = true
}
// 得到 点踩数量
const reqCommentDislikes = async () => {
  // 没有 评论id
  if (!commentId) return
  // 判断是文章 还是 设置
  const isArticle = validate()
  // 去除空的判断
  if (!isArticle) return
  // 处理 点赞数量
  let result: null | LikeOrDislikeCounts["data"] = null
  if (isArticle === "文章") result = await getArticleCommentDislikes(commentId)
  if (isArticle === "设置") result = await getSettingCommentDislikes(commentId)
  if (!result) return

  // 处理 点赞数量
  if (result?.count) dislikeCounts.value = result?.count
  // 判断是否 点赞
  const is = result?.userIds?.includes(userId.value)
  if (is) isUserDislike.value = true
}

// like 的映射
const likeTypeMap = {
  false: "like",
  true: "normal",
} as const
// dislike 的映射
const dislikeTypeMap = {
  false: "dislike",
  true: "normal",
} as const

// 判断 是否文章界面 还是 设置界面
const validate = (): void | "文章" | "设置" | "" => {
  const id = props.articleId || props.settingId
  // 验证 信息
  if (!id) {
    console.error("评论区加载失败，没有id")
    ElMessage.warning("评论区加载失败，没有id")
    return
  }
  if (props.articleId && props.settingId) {
    console.error("评论区加载失败，id冲突")
    ElMessage.warning("评论区加载失败，id冲突")
    return
  }
  return props.articleId ? "文章" : props.settingId ? "设置" : ""
}

// 切换 点赞
const toggleLike = async () => {
  // 没有 评论id
  if (!commentId) return
  // 判断是文章 还是 设置
  const isArticle = validate()
  // 去除空的判断
  if (!isArticle) return
  const is = !!isUserLike.value
  try {
    // 切换 是否点赞
    const likeType = likeTypeMap[`${is}`]
    if (isArticle === "文章") {
      // 修改 点赞 状态
      await articleToggleCommentLikes(commentId, {
        articleId: props.articleId,
        likeType,
      })
    }
    if (isArticle === "设置") {
      // 修改 点赞 状态
      await settingToggleCommentLikes(commentId, {
        likeType,
        settingId: props.settingId,
      })
    }
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

// 切换 点踩
const toggleDislike = async () => {
  // 没有 评论id
  if (!commentId) return
  // 判断是文章 还是 设置
  const isArticle = validate()
  // 去除空的判断
  if (!isArticle) return
  const is = !!isUserDislike.value
  try {
    // 切换 是否 点踩
    const dislikeType = dislikeTypeMap[`${is}`]

    if (isArticle === "文章") {
      // 修改 点踩 状态
      await articleToggleCommentDislikes(commentId, {
        articleId: props.articleId,
        dislikeType,
      })
    }
    if (isArticle === "设置") {
      // 修改 点踩 状态
      await settingToggleCommentDislikes(commentId, {
        settingId: props.settingId,
        dislikeType,
      })
    }
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

onMounted(async () => {
  // 得到 点赞数量
  await reqCommentLikes()
  // 得到 点踩数量
  await reqCommentDislikes()
})
</script>

<style scoped lang="scss">
// 更多的 菜单项
.comment-more {
  ::v-deep(.custom-menu) {
    position: absolute;
    left: unset;
    transform: unset;
    right: -10px;
    z-index: 1;
    .title {
      left: 70%;
      right: unset;
      transform: unset;
    }
  }
}
</style>
