<template>
  <div class="flex flex-col">
    <div v-for="reply in replies" class="reply-msg-item">
      <div class="flex gap-10px justify-between overflow-hidden p-[var(--p)]">
        <!-- 头像 -->
        <global-avatar-src
          :account="reply.user.account"
          :avatar="reply.user.avatar"
          :style="{ '--avatar-size': '60px' }"
          class="flex-shrink-0"
        ></global-avatar-src>
        <!-- 中间的信息 -->
        <div class="flex flex-col gap-15px flex-1 overflow-hidden">
          <!-- 谁回复谁 -->
          <div class="cur-text w-fit flex gap-10px">
            <my-tooltip
              class="box-item"
              effect="dark"
              :content="`作者:${reply.user.account}`"
              placement="right"
            >
              <router-link
                :to="`/user/space/${reply.user.account}`"
                class="!hover:color-[var(--primary-links-hover)] font-bold"
                ><span class="max-w-100px line-clamp-1"
                  >{{ reply.user.nickName }}
                </span>
              </router-link>
            </my-tooltip>
            <my-anchor
              :to="
                reply.type === 'article'
                  ? `/doc/${reply.articleId}`
                  : reply.link || ''
              "
              class="!hover:color-[var(--primary-links-hover)] msg-tools"
            >
              {{
                reply.replies?.id ? "回复了我的评论" : "对我的文章发布了评论"
              }}
            </my-anchor>
          </div>
          <!-- 回复信息 -->
          <div class="flex cur-text">
            <span>回复</span>
            <span class="mx-5px">
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="`作者:${userAccount}`"
                placement="right"
              >
                <router-link
                  :to="`/user/space/${userAccount}`"
                  class="color-[var(--at-person-color)] hover:color-[var(--at-person-color-hover)] flex"
                >
                  @<span class="max-w-100px line-clamp-1"
                    >{{ userNickName }} </span
                  >:
                </router-link>
              </my-tooltip>
            </span>
            <span class="flex-1 truncate">
              {{ decompressStringNotError(reply.content) }}
            </span>
          </div>
          <!-- 来源的 信息 -->
          <div v-if="reply.replies?.id" class="origin">
            <div class="cur-text flex">
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="`作者:${reply.replies.user.account}`"
                placement="right"
              >
                <span>{{ reply.replies.user.nickName }}</span>
              </my-tooltip>
              :
              <span class="line-clamp-1">
                {{ decompressStringNotError(reply.replies?.content) }}
              </span>
            </div>
          </div>
          <!-- 时间、回复、点赞、查看 -->
          <div class="flex gap-20px h-25px items-center">
            <div class="cur-text h-inherit flex items-center text-15px">
              {{ moment(reply.updatedAt, "YYYY年MM月DD日 hh:mm") }}
            </div>
            <div class="flex gap-10px items-center h-inherit">
              <!-- 点赞 -->
              <layout-article-comments-likes
                :settingId="reply.settingId"
                :articleId="reply.articleId"
                :commentId="reply.id"
                :targetUserId="reply.userId"
                class="msg-tools"
              ></layout-article-comments-likes>
              <!-- 点踩 -->
              <layout-article-comments-dislikes
                :settingId="reply.settingId"
                :articleId="reply.articleId"
                :commentId="reply.id"
                :targetUserId="reply.userId"
                class="msg-tools"
              ></layout-article-comments-dislikes>
              <!-- 回复 -->
              <div
                class="cur-pointer !hover:color-[var(--primary-links-hover)] msg-tools"
                @click="emitReply(reply)"
              >
                <i class="i-mynaui:chat w-14px h-14px"></i>
                <span>回复</span>
              </div>
              <!-- 查看 -->
              <my-anchor
                :to="
                  reply.type === 'article'
                    ? `/doc/${reply.articleId}`
                    : reply.link || ''
                "
                class="!hover:color-[var(--primary-links-hover)] msg-tools"
              >
                <i
                  class="i-lsicon:view-outline w-15px h-15px translate-y-1px"
                ></i>
                <span>查看</span>
              </my-anchor>
            </div>
          </div>
          <!-- 回复框 -->
          <layout-article-comments-add
            v-if="reply.isShow"
            :addComments="handlerReply"
            :placeholder="`回复 @${reply.user.nickName}:`"
            btnName="回复"
            :settingId="reply.settingId"
            :articleId="reply.articleId"
            :commentId="reply.id"
            ref="addInstance"
            v-bind="$attrs"
          ></layout-article-comments-add>
        </div>
        <!-- 顶层的信息 -->
        <div class="h-90px w-100px cur-text line-clamp-5 flex-shrink-0">
          {{
            decompressStringNotError(reply.parentComment?.content || "") ||
            reply.article?.title ||
            reply.setting?.name
          }}
        </div>
      </div>
    </div>
  </div>
  <!-- loading -->
  <div
    ref="obEl"
    v-my-loading="() => ({ show: isLoading })"
    :style="{ '--mask': '#0000', height: isLoading ? '100%' : '10px' }"
  ></div>
</template>

<script setup lang="ts" name="UserMessageReply">
// 引入 接口
import { AddCommentBody } from "@/api/comments/types/addCommentBody"
import { getUserReply } from "@/api/user/msg"
// 引入 类型
import type { GetUserReply } from "@/api/user/msg/types/getUserReply"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"
import { createIntersectionObserver } from "@/utils/observer"
// 提取 需要的数据
const { userNickName, userAccount } = storeToRefs(useUserStore())

const isLoading = ref(true)

let stopObserver: (() => void) | void
onBeforeUnmount(() => stopObserver?.())
const obEl = ref<HTMLElement>()
onMounted(() => {
  // 初始化 交叉传感器，用于更新数据
  if (obEl.value)
    stopObserver = createIntersectionObserver(obEl.value, {
      enter: async () => {
        // 初始化 后 自增当前页
        if (init) ++pagination.value.currentPage
        await reqReplies()
      },
    })
})

const replies = ref<GetUserReply["data"]["replies"]>([])
const pagination = ref<GetUserReply["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

let init = false
// 请求 得到用户 回复的信息数据
const reqReplies = async () => {
  isLoading.value = true
  // 判断是否超出
  if (init && pagination.value.total) {
    const is =
      pagination.value.total -
        pagination.value.currentPage * pagination.value.pageSize >
      0
    if (is) {
      await reqUserReplyCallback()
    }
    isLoading.value = false
    return
  }
  // 初始化数据
  if (!init) {
    await reqUserReplyCallback(() => {
      init = true
      isLoading.value = false
    })
  }
}

// 得到 数据的回调
const reqUserReplyCallback = async (cb?: () => void) => {
  const result = await getUserReply({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  replies.value = replies.value.concat(addType(result.replies))
  pagination.value = result.pagination
  cb?.()
}

// 添加上类型
const addType = (data: GetUserReply["data"]["replies"]) => {
  return data.map((item) => ({
    ...item,
    type: item.articleId
      ? "article"
      : item.settingId
      ? "setting"
      : item.id
      ? "comment"
      : "",
  }))
}
type curReplyType = GetUserReply["data"]["replies"][0]
let curReply: curReplyType | null = null

// 触发 回复
const emitReply = (reply: curReplyType) => {
  reply.isShow = !reply.isShow
  curReply = reply
}

// 处理 回复的数据信息
const handlerReply = (data: AddCommentBody) => {
  if (!curReply) throw new Error("没有回复的人的数据信息")
  // 处理链接
  data.link = curReply?.link || ""
  data.fromId = curReply.id
  data.parentId = curReply.parentId
  data.fromUserId = curReply.user.id
}
</script>

<!-- vditor 预览 -->
<style lang="scss">
.reply-msg-item {
  --primary-gap: 10px;
  --primary-pd: 10px;
  @extend %vditor-style;
}
</style>

<style scoped lang="scss">
.reply-msg-item {
  border-bottom: 1px solid rgba(128, 128, 128, 0.703);
  // 点赞回复等 按钮
  ::v-deep(.msg-tools) {
    display: flex;
    align-items: center;
    gap: 3px;
    i {
      $size: 13px;
      width: $size;
      height: $size;
    }
    span {
      font-size: 15px;
    }
  }
  // 来源的 信息
  .origin {
    border-left: 2px solid rgba(128, 128, 128, 0.703);
    padding-left: 10px;
  }
}
</style>
