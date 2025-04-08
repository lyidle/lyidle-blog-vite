<template>
  <div class="w-100% h-100% flex flex-col">
    <!-- title部位 -->
    <div
      class="w-100% h-30px flex-shrink-0 line-height-30px text-center text-18px flex justify-center"
    >
      <global-name
        :nick="receiver?.nickName"
        :account="receiver?.account"
        v-if="receiver?.account"
      >
        <template #nick="{ nick }">
          <span class="w-fit max-w-50% truncate cur-text">{{ nick }} </span>
        </template>
      </global-name>
    </div>
    <!-- 消息显示 -->
    <div
      class="w-100% p-15px flex-1 flex-shrink-0 overflow-hidden overflow-y-auto flex flex-col-reverse msg-context"
    >
      <template v-if="receiver?.account">
        <div class="w-100% flex flex-col-reverse gap-[var(--msg-item-gap)]">
          <div
            v-for="item in list"
            :key="item.id"
            class="flex-shrink-0 flex"
            :style="`${isSender(item.receiverId) ? 'justify-content:end' : ''}`"
          >
            <!-- 消息 占 包含块的 一半的位置 -->
            <div
              class="flex gap-[var(--msg-avatar-gap)] w-50%"
              :style="`${
                isSender(item.receiverId)
                  ? 'justify-content: end'
                  : 'flex-direction:row-reverse;justify-content:flex-end;'
              }`"
            >
              <div class="flex flex-col gap-[var(--msg-time-gap)]">
                <div
                  class="cur-text flex"
                  :style="`${
                    isSender(item.receiverId) ? 'justify-content: end' : ''
                  }`"
                >
                  <!-- 气泡 -->
                  <div
                    class="max-w-100% w-fit bg-[var(--msg-pop-bg)] rounded-10px rounded-tr-5px p-10px"
                  >
                    {{ decompressStringNotError(item.content) }}
                  </div>
                </div>
                <!-- 时间 -->
                <div
                  class="cur-text"
                  :style="`${
                    isSender(item.receiverId) ? 'text-align:end;' : ''
                  }`"
                >
                  {{ moment(item.createdAt, "YYYY年MM月DD日 hh:mm:ss") }}
                </div>
              </div>
              <!-- 头像 -->
              <global-avatar-src
                :account="receiver.account"
                :avatar="receiver.avatar"
                :style="{ '--avatar-size': '40px' }"
                containerClass="flex-shrink-0"
              ></global-avatar-src>
            </div>
          </div>
        </div>
      </template>
      <!-- loading -->
      <div
        ref="obEl"
        v-my-loading="() => ({ show: isLoading })"
        :style="{ '--mask': '#0000', height: isLoading ? '100%' : '10px' }"
        class="flex-shrink-0"
      ></div>
      <!-- 提示信息在消息个数大于3时提示 -->
      <div v-if="!isLoading && list.length >= 3" class="text-center">
        <span class="cur-text text-15px">没有更多消息了～</span>
      </div>
    </div>
    <!-- 回复框 -->
    <div class="flex-shrink-0 h-100px"></div>
  </div>
</template>

<script setup lang="ts" name="UserMessageWhisperDialog">
// 引入 api
import { getUserMsgDetails } from "@/api/user/msg"
// 引入 类型
import type { GetUserMsgDetails } from "@/api/user/msg/types/getUserMsgDetails"
// 处理时间
import moment from "@/utils/moment"
// 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"
// 引入仓库
import { useUserStore } from "@/store/user"
import { decompressStringNotError } from "@/utils/compression"
// 提取数据
const { userId } = storeToRefs(useUserStore())

const route = useRoute()

const initialPagination = () => ({
  currentPage: 1,
  pageSize: 10,
})
const list = ref<GetUserMsgDetails["data"]["list"]>([])
const receiver = ref<GetUserMsgDetails["data"]["receiver"]>()
const pagination = ref<GetUserMsgDetails["data"]["pagination"]>(
  initialPagination()
)

const isLoading = ref(true)

// 判断是否是发送者
const isSender = (id: number) => id === userId.value

// 验证
const validate = () => {
  const id = route.query.id
  if (!id || (id && !Number.isInteger(+id))) {
    return false
  } else return +id
}

let init = false
let stopObserver: (() => void) | void
onBeforeUnmount(() => stopObserver?.())
const obEl = ref<HTMLElement>()
// 初始化 交叉传感器
const initCallback = () => {
  // 初始化 交叉传感器，用于更新数据
  if (obEl.value)
    stopObserver = createIntersectionObserver(obEl.value, {
      enter: async () => {
        // 初始化 后 自增当前页
        if (init) ++pagination.value.currentPage
        await reqWhisper()
      },
    })
}
// 重载交叉传感器
const reloadInitCallback = () => {
  stopObserver?.()
  stopObserver = undefined
  init = false
  initCallback()
}

onMounted(() => {
  initCallback()
})
// 请求 得到用户 回复的信息数据
const reqWhisper = async () => {
  // 判断是否超出
  if (init && pagination.value.total) {
    // 需要是 上次的 当前页 来进行判断是否加载下一页
    const is =
      (pagination.value.currentPage - 1) * pagination.value.pageSize <
      pagination.value.total
    if (is) {
      await reqWhisperCallback()
    }
    return
  }
  // 初始化数据
  if (!init) {
    await reqWhisperCallback(() => {
      init = true
    })
  }
}

// 请求
const reqWhisperCallback = async (cb?: () => void) => {
  if (!validate()) return
  isLoading.value = true
  const result = await getUserMsgDetails({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    receiverId: +(route.query.id as string) as number,
  })
  list.value = list.value.concat(result.list)
  pagination.value = result.pagination
  receiver.value = result.receiver
  isLoading.value = false
  cb?.()
}
let preId = route.query.id
watchEffect(async () => {
  if (!validate()) return
  const id = route.query.id
  if (init === true && preId !== id) {
    list.value = []
    receiver.value = undefined
    pagination.value = initialPagination()
    reloadInitCallback()
  }
  preId = id
})
</script>

<style scoped lang="scss">
.msg-context {
  // 每一项消息的 上下间隔
  --msg-item-gap: 15px;
  // 时间和消息之间的间隔
  --msg-time-gap: 8px;
  // 消息和头像的间距
  --msg-avatar-gap: 5px;
  // 消息气泡的颜色
  --msg-pop-bg: #f5f1f4;
  background-color: rgba(175, 175, 175, 0.189);
}
</style>
