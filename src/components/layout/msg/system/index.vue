<template>
  <div class="flex flex-col gap-10px m-[var(--p)]">
    <div
      v-for="data in list"
      :key="data.id"
      class="msg-box p-10px flex flex-col gap-10px"
    >
      <!-- title -->
      <div class="flex gap-20px">
        <div class="cur-text font-bold">
          {{ data.title }}
        </div>
        <div class="cur-text">
          {{ moment(data.createdAt, "YYYY年MM月DD日 hh:mm") }}
        </div>
      </div>
      <!-- 内容 -->
      <div class="cur-text line-height-25px">
        <span v-for="text in data.handler">
          <span>{{ text?.text }}</span>
          <template v-if="text?.tags && text.tags?.type && text.tags?.id">
            <router-link
              v-if="handlerLinkTo(text.tags)"
              :to="handlerLinkTo(text.tags)"
              class="hover:color-[var(--primary-links-hover)]"
            >
              链接
            </router-link>
          </template>
        </span>
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
import { getUserSystemMsg } from "@/api/user/msg"
// 引入 类型
import type { GetUserSystemMsg } from "@/api/user/msg/types/getUserSystemMsg"
import moment from "@/utils/moment"
import { createIntersectionObserver } from "@/utils/observer"

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

const list = ref<GetUserSystemMsg["data"]["list"]>([])
const pagination = ref<GetUserSystemMsg["data"]["pagination"]>({
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
  const result = await getUserSystemMsg({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  list.value = list.value.concat(
    result.list.map((item) => ({
      ...item,
      handler: extractAndWrapTags(item.content),
    }))
  )
  pagination.value = result.pagination
  cb?.()
  isLoading.value = false
}

type handlerTextType = Array<{
  text: string | undefined
  tags?: { id: string; type: linkType }
}>
type linkType = "article" | "comment" | "msg" | "user" | "" | "other"

// 处理文本中的链接
const extractAndWrapTags = (input: string) => {
  const pattern = /\[(article|comment|msg|user|other):(.*?)\]/g
  const result: handlerTextType = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(input)) !== null) {
    // 添加匹配前的普通文本（如果有）
    if (match.index > lastIndex) {
      result.push({
        text: input.substring(lastIndex, match.index),
      })
    }

    // 添加标签信息（text设为undefined）
    result.push({
      text: undefined, // 标签段没有普通文本
      tags: {
        type: match[1] as linkType,
        id: match[2],
      },
    })

    lastIndex = pattern.lastIndex
  }

  // 添加最后一段普通文本（如果有）
  if (lastIndex < input.length) {
    result.push({
      text: input.substring(lastIndex),
    })
  }

  return result
}

// 处理跳转链接
const handlerLinkTo = (tags: handlerTextType[0]["tags"]): string => {
  const type = tags?.type
  const id = tags?.id
  let link = ""
  // 非法判断
  if (!type || !id) return link

  if (type === "article") link = `/doc/${id}`
  if (type === "user") link = `/user/space/${id}?to=home`
  if (type === "msg") return link
  if (type === "comment") {
    const ids = id.split(",")
    const commendId = ids[0]
    const tag = ids[1].split(":")
    const type = tag[0]
    const curId = tag[1]
    if (type === "article") link = `/doc/${curId}/?commentId=${commendId}`
    // 暂时只有 about
    if (type === "setting") link = `/person/about/?commentId=${commendId}`
  }
  if (type === "other") return id.trim()

  return link.trim()
}
</script>
