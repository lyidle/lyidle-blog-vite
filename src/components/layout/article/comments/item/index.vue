<template>
  <div class="comment-item-container">
    <!-- 头像和评论 -->
    <div class="flex justify-between relative">
      <!-- 头像 -->
      <global-avatar-src
        :account="cloneComment.user.account"
        :avatar="cloneComment.user.avatar"
        :style="{ '--avatar-size': avatarSize }"
      ></global-avatar-src>
      <div
        class="w-100% h-100% ml-[var(--primary-pd)] gap-[var(--primary-gap)] flex flex-col"
      >
        <div class="flex gap-10px cur-text">
          <div class="userName">
            <global-name
              :account="cloneComment.user.account"
              :nick="cloneComment.user.nickName"
            >
              <template #nick="{ nick, account }">
                <router-link
                  :to="`/user/space/${account}`"
                  class="font-bold hover:color-[var(--at-person-color-hover)]"
                  ><div class="max-w-100px truncate">{{ nick }}</div>
                </router-link>
              </template>
            </global-name>
          </div>
          <div class="flex gap-8px" v-if="cloneComment.fromId">
            <div>回复</div>
            <div class="global-at">
              <global-name
                :account="cloneComment.fromComment.user.account"
                :nick="cloneComment.fromComment.user.nickName"
              >
                <template #nick="{ nick, account }">
                  <router-link :to="`/user/space/${account}`">
                    <div class="max-w-100px truncate">@{{ nick }}</div>
                  </router-link>
                </template>
              </global-name>
            </div>
            <div>:</div>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment-data w-100% h-100%">
          <!-- 渲染 评论 -->
          <vditor-preview
            :article="{
              content: decompressStringNotError(cloneComment.content),
            }"
            :isExportHtml="false"
            v-if="cloneComment.id"
            v-show="!isEditor"
          ></vditor-preview>
          <layout-article-comments-base v-show="isEditor" ref="editorInstance">
            <template #btns>
              <my-button
                class="h-30px rounded-5px"
                size="small"
                @click="updateComment"
                >修改评论</my-button
              >
            </template>
          </layout-article-comments-base>
        </div>
      </div>
      <!-- more -->
      <div class="comment-more absolute right-[var(--primary-gap)] top-0">
        <global-header-item
          v-model:data="moreItem.data"
          top="5px"
          menu="test"
          :triangle="!!moreItem.len"
        >
          <i
            class="i-ri:more-line w-1em h-1em cur-pointer !hover:color-[var(--primary-links-hover)]"
          ></i>
          <template #custom="{ item: sub }: { item: menuItemType }">
            <my-menu-item v-if="moreItem.len && hasMoreItems(sub)">
              <my-anchor
                :to="sub.to"
                class="topnav-menu-item"
                :style="{ width: moreItem.data.style?.width }"
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
        <div class="cur-text h-25px flex items-center gap-5px">
          {{ moment(cloneComment.updatedAt, "YYYY-MM-DD hh:mm") }}
        </div>
        <!-- 点赞 -->
        <layout-article-comments-likes
          :settingId="settingId"
          :articleId="articleId"
          :commentId
          :targetUserId="cloneComment.userId"
        ></layout-article-comments-likes>
        <!-- 点踩 -->
        <layout-article-comments-dislikes
          :settingId="settingId"
          :articleId="articleId"
          :commentId
          :targetUserId="cloneComment.userId"
        ></layout-article-comments-dislikes>
        <!-- 回复 -->
        <!-- 看 b站 可以自己给自己回复 所以也没有限制 -->
        <!-- v-if="cloneComment.user.account !== userAccount" -->
        <!-- 触发自定义事件 -->
        <div
          class="h-25px flex items-center gap-5px cur-pointer [var(--primary-links-hover)]"
          @click="handlerReply"
        >
          <span class="!hover:color-[var(--primary-links-hover)]">回复</span>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="cur-text flex gap-[var(--primary-gap)]">
        <div class="h-25px flex items-center gap-5px">
          <i class="i-jam:gps w-1em h-1em"></i>
          {{ cloneComment.user?.userProvince }}
        </div>
        <div class="h-25px flex items-center gap-5px">
          <i class="i-icon-park-outline:system w-1em h-1em"></i
          >{{
            cloneComment.user?.userAgent?.split("|")[0].trim() || "未知系统版本"
          }}
        </div>
        <div class="h-25px flex items-center gap-5px">
          <i class="i-arcticons:styxbrowser w-1em h-1em"></i>
          {{
            cloneComment.user?.userAgent?.split("|")[1].trim() ||
            "未知浏览器版本"
          }}
        </div>
      </div>
    </div>
    <div class="pl-65px">
      <slot name="comment-outer"></slot>
    </div>
    <global-report v-model="isShowReport"></global-report>
  </div>
</template>

<script setup lang="ts" name="ArticleCommentsItem">
// 引入 api
import { putComment } from "@/api/comments"
import { addReport } from "@/api/user/report"
// 引入 类型
import type { AddReportBody } from "@/api/user/report/types/addReportBody"
import type { GetComments } from "@/api/comments/types/getComments"
import type { GetCommentsReplies } from "@/api/comments/types/getCommentsReplies"
import type { handlerReplyType } from "../types"
import type { menuItemType, menuView } from "@/components/layout/header/types"
// 引入 解压 函数
import { compressString, decompressStringNotError } from "@/utils/compression"
// 引入 moment
import moment from "@/utils/moment"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 处理错误的函数
import { handlerReqErr } from "@/utils/request/error/successError"
import { cloneDeep } from "lodash-es"
import { mitt } from "@/utils/emitter"

const { userAccount, userToken, userId } = storeToRefs(useUserStore())
// 是否修改
const isEditor = ref(false)
const editorInstance = ref()

// 重新赋值
const initContext = () =>
  editorInstance.value.clearSetValue(
    decompressStringNotError(cloneComment.content)
  )
// 得到 内容
const getValue = () => editorInstance.value.comment() as string

// 验证 文本的 信息
const validateContext = () => editorInstance.value.validate()

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
    //  请求评论的接口
    reqComments: () => void
  }>(),
  {
    avatarSize: "50px",
    articleId: undefined,
    settingId: undefined,
  }
)

// 克隆 comment
const cloneComment = reactive(cloneDeep(props.comment))

// 评论的 id
const commentId = cloneComment.id

// 触发自定义事件
const emit = defineEmits<{
  (e: "reply", options: handlerReplyType): void
}>()

const isShowReport = ref(false)
const reportConfirm = async (data: AddReportBody) => {
  data.type = "comment"
  data.commentId = cloneComment.id
  data.articleId = (props.articleId || 0) <= 0 ? 0 : props.articleId
  data.settingId = (props.settingId || 0) <= 0 ? 0 : props.settingId
  data.targetUserId = cloneComment.userId
  return await addReport(data)
}
provide("reportConfirm", reportConfirm)
// 更多按钮 的 信息
const moreItem = computed(() => {
  const result: menuView = {
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
          isShowReport.value = true
        },
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
        click: () => mitt.emit("deleteCommentById", cloneComment.id),
        // 需要 是本人的评论 或者 作者
      },
    ],
    style: {
      width: "100px",
      pl: "20px",
    },
  }
  let len = 0
  result.data.forEach((item) => {
    if (!item.hide) ++len
  })
  if (!isDelete.value) --len
  if (!isUpdate.value) --len
  return {
    data: result,
    len,
  }
})

let isDelete = ref(false)
let isUpdate = ref(false)
// 是否 显示 编辑等按钮
const hasMoreItems = (sub: menuItemType) => {
  if (sub.hide) return false
  if (sub.name === "举报") {
    if (!userToken.value) return false
    if (userId.value === cloneComment.userId) return false
  }
  // 处理 删除按钮
  if (sub.name === "删除") {
    // 是作者本人 显示
    if (props.author === userAccount.value) {
      isDelete.value = true
      return true
    }
    // 是评论所有者 显示
    if (cloneComment.user.account === userAccount.value) {
      isDelete.value = true
      return true
    }
    isDelete.value = false
    return false
  }

  // 处理 修改的 按钮
  if (sub.name === "修改") {
    // 是评论所有者 显示
    if (cloneComment.user.account === userAccount.value) {
      isUpdate.value = true
      return true
    }
    isUpdate.value = false
    return false
  }

  // 其他的 是显示
  return true
}

// 更新 内容
const updateComment = async () => {
  // 验证 是否通过
  if (!validateContext()) return
  try {
    const content = compressString(getValue()) || ""
    // 修改 内容信息
    await putComment({
      commentId,
      content: content,
    })
    // 记录id
    const tempId = cloneComment.id
    // @ts-ignore 重置id
    cloneComment.id = false
    cloneComment.content = content
    // 页面渲染后再次赋值回来 触发v-if 的评论预览
    nextTick(() => (cloneComment.id = tempId))

    isEditor.value = false
    ElMessage.success("修改成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("修改失败")
  }
}

// 回复 的回调
const handlerReply = () => {
  // 触发 回复的信息框
  emit("reply", {
    showId: props.parentId || cloneComment.id,
    fromId: cloneComment.id,
    fromNickName: cloneComment.user.nickName,
  })

  // 不等于自身 且有 id
  const fromUserId =
    (userId.value !== cloneComment.user.id && cloneComment.user.id) || null
  // 触发 回复的   fromUserId: number | null
  mitt.emit("reply:userId", fromUserId)
}
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
