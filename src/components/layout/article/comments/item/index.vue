<template>
  <div>
    <!-- 头像和评论 -->
    <div class="flex justify-between relative">
      <!-- 头像 -->
      <global-avatar-src
        :account="comment.user.account"
        :avatar="comment.user.avatar"
        style="--avatar-size: 50px"
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
      <div class="comment-more absolute right-[var(--primary-gap)] top-0">
        <global-header-item v-model:data="moreItem" top="5px" menu="test">
          <i
            class="i-ri:more-line w-1em h-1em cur-pointer hover:color-[var(--primary-links-hover)]"
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
        <!-- 触发自定义事件 -->
        <div
          class="h-25px flex items-center gap-5px cur-pointer hover:color-[var(--primary-links-hover)]"
          @click="
            emit('reply', {
              showId: parentId || comment.id,
              fromId: comment.id,
              fromNickName: comment.user.nickName,
            })
          "
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
import type { menuItemType, menuView } from "@/components/layout/header/types"
// 引入 解压 函数
import { decompressStringNotError } from "@/utils/compression"
// 引入 moment
import moment from "@/utils/moment"
import { nanoid } from "nanoid"
// 引入 仓库
import { useUserStore } from "@/store/user"
const { userAccount, userToken } = storeToRefs(useUserStore())

const props = defineProps<{
  comment: GetComments["data"][0]
  author: string
  parentId?: number
}>()
// 触发自定义事件
const emit = defineEmits<{
  (e: "reply", options: handlerReplyType): void
}>()

// 更多按钮 的 信息
const moreItem = computed(() => {
  return {
    data: [
      {
        id: nanoid(),
        name: "设为置顶",
        click: async () => {
          // 置顶的 逻辑
        },
        // 是文字的 所有者
        hide: userAccount.value !== props.author,
      },
      {
        id: nanoid(),
        name: "举报",
        click: async () => {
          // 举报的 逻辑
        },
        // 登录了的 用户
        hide: !userToken.value,
      },
      {
        id: nanoid(),
        name: "修改",
        click: async () => {
          // 修改的 逻辑
        },
        // 需要 是本人的评论
      },
      {
        id: nanoid(),
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
</script>

<style scoped lang="scss">
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
