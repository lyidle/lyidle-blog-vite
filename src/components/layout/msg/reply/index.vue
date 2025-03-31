<template>
  <div class="flex flex-col p-10px">
    <div v-for="reply in replies" class="p-10px reply-msg-item">
      <div class="flex gap-20px justify-between">
        <!-- 头像 -->
        <global-avatar-src
          :account="reply.user.account"
          :avatar="reply.user.avatar"
          :style="{ '--avatar-size': '60px' }"
          class="flex-shrink-0"
        ></global-avatar-src>
        <!-- 中间的信息 -->
        <div class="flex flex-col gap-10px flex-1">
          <!-- 谁回复谁 -->
          <div class="cur-text w-fit">
            <my-tooltip
              class="box-item"
              effect="dark"
              :content="`作者:${reply.user.account}`"
              placement="right-start"
            >
              <router-link
                :to="`/user/space/${reply.user.account}`"
                class="!hover:color-[var(--primary-links-hover)] font-bold"
                >{{ reply.user.nickName }}
              </router-link>
            </my-tooltip>
            {{ reply.replies?.id ? "回复了我的评论" : "对我的文章发布了评论" }}
          </div>
          <!-- 回复信息 -->
          <div class="flex cur-text">
            <span>回复</span>
            <span class="mx-5px">
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="`作者:${userAccount}`"
                placement="right-start"
              >
                <router-link
                  :to="`/user/space/${userAccount}`"
                  class="color-[var(--at-person-color)] hover:color-[var(--at-person-color-hover)]"
                >
                  @{{ userNickName }}:
                </router-link>
              </my-tooltip>
            </span>
            <span class="flex-1 line-clamp-1">
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
                placement="right-start"
              >
                <span>{{ reply.replies.user.nickName }}</span>
              </my-tooltip>
              :
              <span class="line-clamp-1">
                {{ decompressStringNotError(reply.replies?.content) }}
                quo.
              </span>
            </div>
          </div>
          <!-- 时间、回复、点赞 -->
          <div class="flex gap-20px h-25px items-center">
            <div class="cur-text h-inherit flex items-center">
              {{ moment(reply.updatedAt, "YYYY年MM月DD日 hh:mm") }}
            </div>
            <div class="flex gap-10px items-center h-inherit">
              <!-- 点赞 -->
              <layout-article-comments-likes
                :settingId="reply.settingId"
                :articleId="reply.articleId"
                :commentId="reply.id"
                class="msg-tools"
              ></layout-article-comments-likes>
              <!-- 点踩 -->
              <layout-article-comments-dislikes
                :settingId="reply.settingId"
                :articleId="reply.articleId"
                :commentId="reply.id"
                class="msg-tools"
              ></layout-article-comments-dislikes>
              <!-- 回复 -->
              <div
                class="cur-pointer !hover:color-[var(--primary-links-hover)] msg-tools"
              >
                <i class="i-mynaui:chat w-14px h-14px ml-5px"></i>
                <span>回复</span>
              </div>
              <!-- 查看 -->
              <router-link
                v-if="reply.articleId"
                :to="`/doc/${reply.articleId}`"
                class="!hover:color-[var(--primary-links-hover)] msg-tools"
              >
                <i
                  class="i-lsicon:view-outline w-15px h-15px ml-5px translate-y-1px"
                ></i>
                <span>查看</span>
              </router-link>
              <!-- 如果是settingId的话 暂时就只有about -->
              <router-link
                v-if="reply.settingId"
                :to="`/person/about`"
                class="!hover:color-[var(--primary-links-hover)] msg-tools"
              >
                <i
                  class="i-lsicon:view-outline w-15px h-15px ml-5px translate-y-1px"
                ></i>
                <span>查看</span>
              </router-link>
            </div>
          </div>
        </div>
        <!-- 顶层的信息 -->
        <div
          v-if="reply.parentComment?.id"
          class="h-90px w-100px cur-text line-clamp-5"
        >
          {{ decompressStringNotError(reply.parentComment?.content || "") }}
        </div>
        <!-- 不是评论 是文章 -->
        <layout-msg-reply-content
          v-else
          :articleId="reply.articleId"
          :settingId="reply.settingId"
          class="h-90px w-100px cur-text line-clamp-5"
        >
        </layout-msg-reply-content>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageReply">
// 引入 接口
import { getUserReply } from "@/api/user/msg"
// 引入 类型
import type { GetUserReply } from "@/api/user/msg/types/getUserReply"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"
// 提取 需要的数据
const { userNickName, userAccount } = storeToRefs(useUserStore())

const replies = ref<GetUserReply["data"]["replies"]>([])
const pagination = ref<GetUserReply["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

// 请求 得到用户 回复的信息数据
const reqReplies = async () => {
  const result = await getUserReply({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  replies.value = replies.value.concat(result.replies)
  pagination.value = result.pagination
}
onMounted(reqReplies)
</script>

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
