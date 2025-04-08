<template>
  <div class="flex flex-col gap-15px">
    <div
      v-for="item in list"
      :key="item.id"
      class="flex gap-10px px-20px py-15px item-at"
    >
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <global-avatar-src
          :account="item.mentionedBy.account"
          :avatar="item.mentionedBy.avatar"
          :style="{ '--avatar-size': '60px' }"
        ></global-avatar-src>
      </div>
      <div class="flex flex-col justify-center gap-5px">
        <!-- 提示信息 -->
        <div class="flex gap-10px">
          <global-name
            class="box-item"
            :account="item.mentionedBy.account"
            :nick="item.mentionedBy.nickName"
          >
            <template #nick="{ nick, account }">
              <router-link
                :to="`/user/space/${account}`"
                class="!hover:color-[var(--primary-links-hover)] font-bold"
                ><span class="max-w-100px line-clamp-1">{{ nick }} </span>
              </router-link>
            </template>
          </global-name>
          <span class="cur-text">at了我</span>
        </div>
        <!-- at的信息 -->
        <div class="cur-text at-data">
          {{ decompressStringNotError(item.comment.content) }}
        </div>
        <div class="flex gap-15px h-15px items-center">
          <!-- 时间 -->
          <div class="cur-text text-15px">
            {{ moment(item.createdAt, "YYYY年MM月DD日 hh:mm") }}
          </div>
          <!-- 查看 -->
          <my-anchor
            :to="item.link"
            class="!hover:color-[var(--primary-links-hover)] flex gap-3px"
          >
            <i class="i-lsicon:view-outline w-15px h-15px translate-y-1px"></i>
            <span class="text-15px">查看</span>
          </my-anchor>
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

<script setup lang="ts" name="UserMessageAt">
// 引入 api
import { getUserAt } from "@/api/user/msg"
// 引入 类型
import type { GetUserAt } from "@/api/user/msg/types/getUserAt"
// 解压文本
import { decompressStringNotError } from "@/utils/compression"
// 处理时间
import moment from "@/utils/moment"
// 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"

const isLoading = ref(true)

const list = ref<GetUserAt["data"]["list"]>([])
const pagination = ref<GetUserAt["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})
let init = false

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
        await reqAt()
      },
    })
})
// 请求 得到用户 回复的信息数据
const reqAt = async () => {
  // 判断是否超出
  if (init && pagination.value.total) {
    // 需要是 上次的 当前页 来进行判断是否加载下一页
    const is =
      (pagination.value.currentPage - 1) * pagination.value.pageSize <
      pagination.value.total
    if (is) {
      await reqAtCallback()
    }
    return
  }
  // 初始化数据
  if (!init) {
    await reqAtCallback(() => {
      init = true
    })
  }
}
// 请求
const reqAtCallback = async (cb?: () => void) => {
  isLoading.value = true
  const result = await getUserAt({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  list.value = list.value.concat(result.list)
  pagination.value = result.pagination
  isLoading.value = false
  cb?.()
}
</script>

<style lang="scss" scoped>
.at-data {
  border-left: 2px solid rgba(128, 128, 128, 0.703);
}
.item-at {
  border-bottom: 1px solid rgba(159, 159, 159, 0.305);
}
</style>
