<template>
  <div class="whisper-msg-container w-100% h-100% flex flex-col">
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
      ref="msgContext"
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
                  @contextmenu="mitt.emit('isSendPopMenu', item.id)"
                >
                  <!-- 气泡 -->
                  <div
                    class="popmsg max-w-100% w-fit rounded-10px rounded-tr-5px"
                    :class="isSender(item.senderId) && 'owner'"
                  >
                    <!-- 渲染 消息 -->
                    <vditor-preview
                      :article="{
                        content: decompressStringNotError(item.content),
                      }"
                      :isExportHtml="false"
                    ></vditor-preview>
                  </div>
                </div>
                <!-- 时间 -->
                <div
                  class="cur-text"
                  :style="`${isSender(item.senderId) ? 'text-align:end;' : ''}`"
                >
                  {{ handlerTime(item.createdAt) }}
                </div>
              </div>
              <!-- 接收者的 头像 -->
              <global-avatar-src
                v-if="!isSender(item.senderId)"
                :account="receiver.account"
                :avatar="receiver.avatar"
                :style="{ '--avatar-size': '40px' }"
                containerClass="flex-shrink-0"
              ></global-avatar-src>
              <!-- 发送者的 头像 -->
              <global-avatar-src
                v-else
                :account="userAccount"
                :avatar="userNickName"
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
    <div
      class="inputContainer flex-shrink-0 h-125px overflow-hidden overflow-y-auto p-10px relative"
      ref="inputContainer"
    >
      <layout-article-comments-base ref="instance" mt="0" pb="0" prefix="消息">
        <template #btns>
          <my-button class="h-30px rounded-5px" size="small" @click="sendMsg">
            发送</my-button
          >
        </template>
      </layout-article-comments-base>
      <div
        class="resize-input w-20px h-2px absolute top-0 left-50% translate-x-[-50%] cursor-row-resize"
        ref="inputResize"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageWhisperDialog">
// 引入 api
import { getUserMsgDetails, sendUserMsg, userMsgStatus } from "@/api/user/msg"
// 引入 类型
import type { GetUserMsgDetails } from "@/api/user/msg/types/getUserMsgDetails"
// 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"
// 引入仓库
import { useUserStore } from "@/store/user"
import { decompressStringNotError } from "@/utils/compression"
import { formatMilliseconds } from "@/utils/times/timeFormatter"
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
import { unionBy } from "lodash-es"
import { useEventListener } from "@/hooks/useEventListener"
import { handlerReqErr } from "@/utils/request/error/successError"
import { nanoid } from "nanoid"
import { mitt } from "@/utils/emitter"
// 提取数据
const { userId, userAccount, userNickName } = storeToRefs(useUserStore())

// 处理时间
const handlerTime = (time: string) => {
  // @ts-ignore
  const now = formatMilliseconds(Date.now() - new Date(time))
  return now + "前"
}

const route = useRoute()
const router = useRouter()

// 拖动 改变 输入框的 元素
const inputResize = ref()
// 需要改变高度 的 元素
const inputContainer = ref()
// 存储初始位置和高度
const initialY = ref(0)
const initialHeight = ref(0)
// 监听 鼠标按下与松开
useEventListener(inputResize, "mousedown", ($e) => {
  const e = $e as MouseEvent
  // 不是鼠标左键 则退出
  if (e.button !== 0) return
  // 阻止默认行为，防止选中文本等
  e.preventDefault()

  // 记录初始位置和高度
  initialY.value = e.clientY
  initialHeight.value = inputContainer.value?.clientHeight || 0

  // 添加窗口级别的事件监听
  useEventListener("mousemove", handleMouseMove)
  useEventListener("mouseup", handleMouseUp, { once: true })
})
// 鼠标移动处理函数
const handleMouseMove = ($e: Event) => {
  const e = $e as MouseEvent
  if (!inputContainer.value) return

  // 计算鼠标移动的垂直距离
  const deltaY = initialY.value - e.clientY

  // 计算新的高度（不能小于某个最小值，比如50px）
  const newHeight = Math.max(125, initialHeight.value + deltaY)

  // 设置新高度
  inputContainer.value.style.height = `${newHeight}px`
}

// 鼠标松开处理函数
const handleMouseUp = () => {
  // 移除鼠标移动事件监听
  window.removeEventListener("mousemove", handleMouseMove)
}

// 监听删除消息的事件
const popmsgDelComplete = (id: number) => {
  const index = list.value.findIndex((item) => item.id === id)
  list.value.splice(index, 1)
}
mitt.on("popmsgDelComplete", popmsgDelComplete)
onBeforeUnmount(() => {
  mitt.off("popmsgDelComplete", popmsgDelComplete)
})
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
  const msgId = nanoid()
  const updateBody = {
    content: text,
    receiverId,
    msgId,
  }
  // 处理图片
  await useMdReplaceImg(text, updateBody, {
    path: `/msg/${msgId}`,
  })
  try {
    // 发送内容
    const result = await sendUserMsg(updateBody)

    list.value.unshift(result)
    // 重置 内容
    reset()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("发送信息失败")
  }
}

// 初始化 轮播状态的函数
const initialPagination = () => ({
  currentPage: 1,
  pageSize: 10,
})

type listType = GetUserMsgDetails["data"]["list"]
const list = ref<listType>([])
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
        const tempCurrentpage = pagination.value.currentPage
        pagination.value.currentPage = 1
        // 重新请求数据
        await reqWhisperCallback({
          orderByCreated: true,
        })
        pagination.value.currentPage = tempCurrentpage
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
const msgContext = ref()
// 请求
const reqWhisperCallback = async (options?: {
  cb?: () => void
  orderByCreated?: boolean
}) => {
  if (!validate()) return
  const cb = options?.cb
  const orderByCreated = options?.orderByCreated
  isLoading.value = true
  const result = await getUserMsgDetails({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    receiverId: +(route.query.id as string) as number,
  })

  // 获取滚动位置
  let scrollTopBeforeUpdate = msgContext.value?.scrollTop || 0
  let scrollHeightBeforeUpdate = msgContext.value?.scrollHeight || 0

  const newData = unionBy(list.value, result.list, "id")
  // 是否自动赋值
  list.value = orderByCreated ? orderList(newData) : newData
  pagination.value = result.pagination
  receiver.value = result.receiver
  isLoading.value = false
  cb?.()

  await nextTick()

  // 更新滚动位置
  if (msgContext.value) {
    const scrollHeightAfterUpdate = msgContext.value.scrollHeight
    const heightDiff = scrollHeightAfterUpdate - scrollHeightBeforeUpdate
    msgContext.value.scrollTop = scrollTopBeforeUpdate + heightDiff
  }
  return result
}

// 对数据进行排序 当数据更新时需要排序，获得 回复时需要
const orderList = (data: listType): listType => {
  return data.sort(
    (a, b) => (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any)
  )
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
%owner-popmsg {
  background-color: #80b9f2;
  color: #eef7ff;
}
%owner-popmsg-dark {
  background-color: #4c7dae;
  color: #eef7ff;
}
.whisper-msg-container {
  ::v-deep(.vditor-style) {
    padding: 0;
    min-height: 30px;
    min-width: 100px;
    padding: 10px;
    img {
      display: block;
      max-width: 250px;
    }
    @for $i from 1 through 6 {
      h#{$i} {
        border-color: currentColor !important;
        .vditor-anchor {
          svg {
            display: none;
          }
        }
      }
    }
  }
  // 输入框的 vditor
  .inputContainer {
    ::v-deep(.vditor-style) {
      @extend %owner-popmsg;
    }
  }
  .msg-context {
    // 每一项消息的 上下间隔
    --msg-item-gap: 15px;
    // 时间和消息之间的间隔
    --msg-time-gap: 8px;
    // 消息和头像的间距
    --msg-avatar-gap: 5px;
    // 消息气泡
    .popmsg {
      // 接收者
      ::v-deep(.vditor-style) {
        background-color: var(--primary-card-bg);
        color: var(--primary-color);
      }
      // 自身
      &.owner {
        ::v-deep(.vditor-style) {
          @extend %owner-popmsg;
        }
      }
    }
    border: var(--whisper-border);
    border-left: none;
    border-right: none;
    background-color: rgba(175, 175, 175, 0.189);
  }

  // 输入框拖拽 元素
  .resize-input {
    background-color: #9bb9d3;
  }
}
html[themes$="dark"] {
  .msg-context {
    .popmsg {
      // 自身
      &.owner {
        ::v-deep(.vditor-style) {
          @extend %owner-popmsg-dark;
        }
      }
    }
    background-color: rgba(51, 51, 51, 0.233);
  }

  // 输入框拖拽 元素
  .resize-input {
    background-color: #638aac;
  }
}
</style>
