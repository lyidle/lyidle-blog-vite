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
            :style="`${isSender(item.senderId) ? 'justify-content:end' : ''}`"
          >
            <!-- 消息 占 包含块的 一半的位置 -->
            <div
              class="flex gap-[var(--msg-avatar-gap)] w-50%"
              :style="`${
                isSender(item.senderId)
                  ? 'justify-content: end'
                  : 'flex-direction:row-reverse;justify-content:flex-end;'
              }`"
            >
              <div class="flex flex-col gap-[var(--msg-time-gap)]">
                <div
                  class="cur-text flex"
                  :style="`${
                    isSender(item.senderId) ? 'justify-content: end' : ''
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
                  :style="`${isSender(item.senderId) ? 'text-align:end;' : ''}`"
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
    <div class="flex-shrink-0 h-125px overflow-hidden overflow-y-auto p-10px">
      <layout-article-comments-base ref="instance" mt="0" pb="0" prefix="消息">
        <template #btns>
          <my-button class="h-30px rounded-5px" size="small" @click="sendMsg">
            发送</my-button
          >
        </template>
      </layout-article-comments-base>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageWhisperDialog">
// 引入 api
import { getUserMsgDetails, sendUserMsg, userMsgStatus } from "@/api/user/msg"
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
const router = useRouter()

// 输入框的 组件实例
const instance = ref()
// 得到 内容
const comment = () => instance.value.comment() as string
// 重置 内容
const reset = () => instance.value.reset()
// 验证 内容
const validateContext = () => {
  // 验证内容长度
  if (!instance.value.validate()) return
  return true
}

// 发送消息
const sendMsg = async () => {
  // 非法判断
  let receiverId: number | string = route.query.id as string
  if (!receiverId) return
  receiverId = +receiverId
  // 不是整数
  if (!Number.isInteger(receiverId)) return

  // 验证内容信息
  if (!validateContext()) return
  // 得到内容
  const text = comment()
  // 发送内容
  const result = await sendUserMsg({
    content: text,
    receiverId,
  })
  list.value.unshift(result)
  // 重置 内容
  reset()
}

// 初始化 轮播状态的函数
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
const stopIntersection = () => {
  // 停止交叉传感器
  stopObserver?.()
  // 停止轮询
  pollingController.stop()
}
onBeforeUnmount(stopIntersection)
const obEl = ref<HTMLElement>()
// 初始化 交叉传感器
const initCallback = () => {
  // 初始化 交叉传感器，用于更新数据
  if (obEl.value)
    stopObserver = createIntersectionObserver(obEl.value, {
      enter: async () => {
        // 初始化 后 自增当前页
        if (init) ++pagination.value.currentPage
        let temp = init
        await reqWhisper()
        // 没有初始化
        if (!temp) {
          // 初始化消息轮询
          pollingController.start()
        }
      },
    })
}
// 重载交叉传感器
const reloadInitCallback = () => {
  stopIntersection()
  stopObserver = undefined
  init = false
  initCallback()
}

onMounted(async () => {
  const userId = route.query.id
  if (!userId || !Number.isInteger(+userId)) {
    ElMessage.warning("查询的消息id不合法")
    isLoading.value = false
    router.replace("/user/msg?to=whisper")
    return
  }
  // 初始化 交叉传感器
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
    await reqWhisperCallback({
      cb: () => {
        init = true
      },
    })
  }
}

type pollingControllerType = {
  isRunning: boolean
  retryCount: number
  maxDelay: number
  timer: null | setTimout
  start: () => void
  stop: () => void
  _poll: () => void
}

// 消息轮询控制器（可全局管理）
const pollingController: pollingControllerType = {
  isRunning: false,
  retryCount: 0,
  maxDelay: 5000, // 最大延迟5秒
  timer: null,
  // 启动轮询
  start: async function () {
    if (this.isRunning) return
    this.isRunning = true
    console.log(`开始轮询:${route.query.id}`)
    this._poll()
  },

  // 停止轮询
  stop: function () {
    this.timer && clearTimeout(this.timer)
    this.isRunning = false
    this.retryCount = 0
  },

  // 实际轮询逻辑
  _poll: async function () {
    try {
      const userId = route.query.id
      if (!userId || !Number.isInteger(+userId))
        throw new Error("查询的消息id不合法")

      // 1. 检查新消息状态
      const statusRes = await userMsgStatus(+userId)
      console.log(statusRes, "轮询状态")
      if (statusRes) {
        // 重载数据 重新请求
        reloadInstance()
        this.retryCount = 0 // 重置重试计数
      }
    } catch (error) {
      console.error("轮询异常:", error)
    } finally {
      // 3. 计算下次轮询时间（指数退避）
      const delay = Math.min(5000 * Math.pow(2, this.retryCount), this.maxDelay)
      this.retryCount++

      // 4. 继续轮询
      if (this.isRunning) {
        this.timer = setTimeout(() => this._poll(), delay)
      }
    }
  },
}

// 请求
const reqWhisperCallback = async (options?: {
  cb?: () => void
  notConbin?: boolean
}) => {
  if (!validate()) return
  const cb = options?.cb
  const notConbin = options?.notConbin
  isLoading.value = true
  const result = await getUserMsgDetails({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    receiverId: +(route.query.id as string) as number,
  })
  // 是否自动赋值
  if (!notConbin) {
    list.value = list.value.concat(result.list)
    pagination.value = result.pagination
    receiver.value = result.receiver
  }
  isLoading.value = false
  cb?.()
  return result
}

// 重载数据 重新请求
const reloadInstance = () => {
  list.value = []
  receiver.value = undefined
  pagination.value = initialPagination()
  reloadInitCallback()
}

let preId = route.query.id
watchEffect(async () => {
  if (!validate()) return
  const id = route.query.id
  if (init === true && preId !== id) {
    // 重载数据 重新请求
    reloadInstance()
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
