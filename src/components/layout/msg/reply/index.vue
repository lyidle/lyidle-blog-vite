<template>
  <div class="flex flex-col">
    <div v-for="reply in replies" class="reply-msg-item" :key="reply.id">
      <div
        class="reply-container flex gap-0.625rem justify-between overflow-hidden p-[var(--p)]"
      >
        <div class="flex-shrink-0 flex justify-center reply-avatar">
          <!-- 头像 -->
          <global-avatar-src
            :account="reply.user.account"
            :avatar="reply.user.avatar"
            :style="{ '--avatar-size': '3.75rem' }"
          ></global-avatar-src>
        </div>
        <div class="flex-1 flex context">
          <!-- 中间的信息 -->
          <div
            class="flex flex-col gap-0.9375rem flex-1 overflow-hidden content-desc"
          >
            <!-- 谁回复谁 -->
            <div class="cur-text w-fit flex gap-0.625rem">
              <global-name
                class="box-item"
                :account="reply.user.account"
                :nick="reply.user.nickName"
              >
                <template #nick="{ nick, account }">
                  <router-link
                    :to="`/user/space/${account}`"
                    class="!hover:color-[var(--primary-links-hover)] font-bold"
                    ><span class="max-w-6.25rem line-clamp-1">{{ nick }} </span>
                  </router-link>
                </template>
              </global-name>
              <my-anchor
                :to="
                  reply.type === 'article'
                    ? reply.link ||
                      `/doc/${reply.articleId}?commentId=${reply.id}`
                    : reply.link || ''
                "
                class="!hover:color-[var(--primary-links-hover)] msg-tools"
              >
                {{
                  reply.type === "comment"
                    ? "回复了我的评论"
                    : "对我的文章发布了评论"
                }}
              </my-anchor>
            </div>
            <!-- 回复信息 -->
            <div class="flex cur-text">
              <span class="flex-shrink-0">回复</span>
              <!-- 是自身本地的用户 -->
              <span class="mx-0.3125rem flex-shrink-0">
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
                    @<span class="max-w-6.25rem line-clamp-1"
                      >{{ userNickName }} </span
                    >:
                  </router-link>
                </my-tooltip>
              </span>
              <span class="line-clamp-1">
                {{ decompressStringNotError(reply.content) }}
              </span>
            </div>
            <!-- 来源的 信息 -->
            <div v-if="reply.fromComment?.id" class="origin">
              <div class="cur-text flex">
                <global-name
                  class="box-item"
                  :account="reply.fromComment.user.account"
                  :nick="reply.fromComment.user.nickName"
                ></global-name>
                :
                <span class="line-clamp-1">
                  {{ decompressStringNotError(reply.fromComment?.content) }}
                </span>
              </div>
            </div>
            <!-- 时间、回复、点赞、查看 -->
            <div class="flex gap-1.25rem h-1.5625rem items-center">
              <div class="cur-text h-inherit flex items-center text-0.9375rem">
                {{ moment(reply.updatedAt, "YYYY年MM月DD日 hh:mm") }}
              </div>
              <div class="flex gap-0.625rem items-center h-inherit">
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
                  <i class="i-mynaui:chat w-0.875rem h-0.875rem"></i>
                  <span>回复</span>
                </div>
                <!-- 查看 -->
                <my-anchor
                  :to="
                    reply.type === 'article'
                      ? reply.link ||
                        `/doc/${reply.articleId}?commentId=${reply.id}`
                      : reply.link || ''
                  "
                  class="!hover:color-[var(--primary-links-hover)] msg-tools"
                >
                  <i
                    class="i-lsicon:view-outline w-0.9375rem h-0.9375rem translate-y-0.0625rem"
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
          <div
            class="h-5.625rem w-100px cur-text line-clamp-5 flex-shrink-0 topContent"
          >
            {{
              decompressStringNotError(reply.parentComment?.content || "") ||
              reply.article?.title ||
              reply.setting?.name
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- loading -->
  <div
    ref="obEl"
    v-my-loading="() => ({ show: isLoading })"
    :style="{ '--mask': '#0000', height: isLoading ? '100%' : '0.625rem' }"
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
  // 判断是否超出
  if (init && pagination.value.total) {
    // 需要是 上次的 当前页 来进行判断是否加载下一页
    const is =
      (pagination.value.currentPage - 1) * pagination.value.pageSize <
      pagination.value.total
    if (is) {
      await reqUserReplyCallback()
    }
    return
  }
  // 初始化数据
  if (!init) {
    await reqUserReplyCallback(() => {
      init = true
    })
  }
}

// 得到 数据的回调
const reqUserReplyCallback = async (cb?: () => void) => {
  isLoading.value = true
  const result = await getUserReply({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  replies.value = replies.value.concat(addType(result.replies))
  pagination.value = result.pagination
  cb?.()
  isLoading.value = false
}

// 添加上类型
const addType = (data: GetUserReply["data"]["replies"]) => {
  return data?.map((item) => {
    return {
      ...item,
      type: item.parentComment?.id
        ? "comment"
        : item.articleId
        ? "article"
        : item.settingId
        ? "setting"
        : "",
    }
  })
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
  --primary-gap: 0.625rem;
  --primary-pd: 0.625rem;
  @extend %vditor-style;
}
</style>

<style scoped lang="scss">
.reply-msg-item {
  border-bottom: 0.0625rem solid rgba(128, 128, 128, 0.703);
  // 点赞回复等 按钮
  ::v-deep(.msg-tools) {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
    i {
      $size: 0.8125rem;
      width: $size;
      height: $size;
    }
    span {
      font-size: 0.9375rem;
    }
  }
  // 来源的 信息
  .origin {
    border-left: 0.125rem solid rgba(128, 128, 128, 0.703);
    padding-left: 0.625rem;
  }
  .reply-container {
    @include media(xs) {
      flex-direction: column;
      $gap: 0.5rem;
      gap: $gap;
      .reply-avatar {
        width: fit-content;
      }
      .context {
        flex-direction: column;
        gap: $gap;
        .content-desc {
          gap: $gap;
        }
        .topContent {
          height: fit-content;
          width: 100%;
          -webkit-line-clamp: 3;
          line-clamp: 3;
        }
      }
    }
  }
}
</style>
