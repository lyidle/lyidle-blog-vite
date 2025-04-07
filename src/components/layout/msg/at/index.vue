<template>
  <div class="flex flex-col gap-20px">
    <div v-for="item in list" :key="item.id" class="flex gap-10px">
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
import { GetUserAt } from "@/api/user/msg/types/getUserAt"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"

const isLoading = ref(true)

const list = ref<GetUserAt["data"]["list"]>([])
const pagination = ref<GetUserAt["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

// 请求
const reqAt = async () => {
  isLoading.value = true
  const result = await getUserAt({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  list.value = result.list
  pagination.value = result.pagination
  isLoading.value = false
}
onMounted(reqAt)
</script>

<style lang="scss" scoped>
.at-data {
  border-left: 2px solid rgba(128, 128, 128, 0.703);
}
</style>
