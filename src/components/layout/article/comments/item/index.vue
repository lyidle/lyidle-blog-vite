<template>
  <div>
    <!-- 头像和评论 -->
    <div class="flex justify-between relative">
      <!-- 头像 -->
      <global-avatar-src
        :account="comment.user.account"
        :avatar="comment.user.avatar"
        style="--avatar-size: 60px"
      ></global-avatar-src>
      <div
        class="w-100% h-100% ml-[var(--primary-pd)] gap-[var(--primary-gap)] flex flex-col"
      >
        <div class="userName cur-text font-bold">
          {{ comment.user.nickName }}
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
          ></vditor-preview>
        </div>
      </div>
      <!-- more -->
      <div class="comment-more absolute right-[var(--primary-pd)] top-0 z-10">
        <global-header-item v-model:data="moreItem" top="5px" menu="test">
          <i
            class="i-ri:more-line w-1em h-1em cur-pointer hover:color-[var(--primary-links-hover)]"
          ></i
        ></global-header-item>
      </div>
    </div>
    <!-- 评论下方的 用户、点赞等信息 与按钮 -->
    <div class="mt-[var(--primary-gap)] pl-65px flex justify-between">
      <!-- 操作按钮 -->
      <div class="cur-text flex gap-20px">
        <!-- 更新时间 -->
        <div class="h-25px flex items-center gap-5px">
          {{ moment(comment.updatedAt, "YYYY-MM-DD hh:mm") }}
        </div>
        <!-- 点赞 -->
        <div class="h-25px flex items-center gap-5px">
          <i
            class="i-uiw:like-o w-1em h-1em cur-pointer hover:color-[var(--primary-links-hover)]"
          ></i>
        </div>
        <!-- 点踩 -->
        <div class="h-25px flex items-center gap-5px">
          <i
            class="i-uiw:dislike-o w-1em h-1em cur-pointer hover:color-[var(--primary-links-hover)]"
          ></i>
        </div>
        <!-- 回复 -->
        <!-- 看 b站 可以自己给自己回复 所以也没有限制 -->
        <!-- v-if="comment.user.account !== userAccount" -->
        <div
          class="h-25px flex items-center gap-5px cur-pointer hover:color-[var(--primary-links-hover)]"
          @click="handlerReply(comment)"
        >
          回复
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
  </div>
</template>

<script setup lang="ts" name="ArticleCommentsItem">
// 引入 类型
import type { GetComments } from "@/api/comments/types/getComments"
import type { handlerReplyType } from "../types"
// 引入 解压 函数
import { decompressStringNotError } from "@/utils/compression"
// 引入 moment
import moment from "@/utils/moment"
// 引入自身的 hooks more的 显示条例
import { moreItems } from "./moreItems"

const props = defineProps<{ comment: GetComments["data"][0]; author: string }>()
// 触发自定义事件
const emit = defineEmits<{
  (e: "reply", options: handlerReplyType): void
}>()

const moreItem = moreItems({ author: props.author })

const handlerReply = (
  comment: GetComments["data"][0] | GetComments["data"][0][0]
) => {
  // 触发自定义事件
  emit("reply", {
    showId: comment.parentId || comment.id,
    fromId: comment.id,
    fromNickName: comment.user.nickName,
  })
}
</script>

<style scoped lang="scss">
.comment-more {
  ::v-deep(.custom-menu) {
    position: absolute;
    left: unset;
    transform: unset;
    right: -10px;
    .title {
      left: 70%;
      right: unset;
      transform: unset;
    }
  }
}
</style>
