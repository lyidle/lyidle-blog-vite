<template>
  <div class="whisper-container w-100% h-100% flex justify-between">
    <!-- 消息选择 -->
    <div class="users-container flex-shrink-0 w-12.5rem h-100% flex flex-col">
      <div class="p-0.3125rem text-center bg-[var(--msg-bg)] title h-1.9375rem">
        <span class="cur-text">近期消息</span>
      </div>
      <div class="flex-shrink-0 flex-1 overflow-hidden overflow-y-auto">
        <div
          v-for="item in list"
          :key="item.id"
          class="flex flex-shrink-0 gap-0.5rem py-0.9375rem items-center cur-pointer list-nav-item"
          :class="{
            active: $route.query.id && +$route.query.id === item.user.id,
          }"
          @click="$router.push($route.path + `?to=whisper&id=${item.user.id}`)"
        >
          <!-- 头像 -->
          <global-avatar-src
            :account="item.user.account"
            :avatar="item.user.avatar"
            :style="{ '--avatar-size': '3.125rem' }"
            :isTo="false"
            containerClass="ml-0.9375rem flex-shrink-0"
          ></global-avatar-src>
          <div
            class="flex h-100% flex-col justify-center gap-0.3125rem nav-content"
          >
            <global-name
              :account="item.user.account"
              :nick="item.user.nickName"
            >
              <template #nick="{ nick }">
                <span class="w-fit max-w-6.25rem line-clamp-1"
                  >{{ nick }}
                </span>
              </template>
            </global-name>
            <div class="w-fit max-w-6.25rem truncate">
              {{ decompressStringNotError(item.message?.content || "") }}
            </div>
          </div>
        </div>
        <!-- loading -->
        <div
          ref="obEl"
          v-my-loading="() => ({ show: isLoading })"
          :style="{
            '--mask': '#0000',
            height: isLoading ? '100%' : '0.625rem',
          }"
          class="flex-shrink-0"
        ></div>
      </div>
    </div>
    <div
      class="flex-1 h-100% overflow-hidden overflow-y-auto bg-[var(--msg-bg)]"
    >
      <layout-msg-whisper-dialog v-if="$route.query.id">
      </layout-msg-whisper-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageWhisper">
// 引入 api
import { userFindByPk } from "@/api/user"
import { getUserMsg } from "@/api/user/msg"
// 引入 类型
import type { GetUserMsg } from "@/api/user/msg/types/getUserMsg"
// 解压文本
import { decompressStringNotError } from "@/utils/compression"
import { createIntersectionObserver } from "@/utils/observer"

const router = useRouter()

const isLoading = ref(true)

const list = ref<GetUserMsg["data"]["list"]>([])
const pagination = ref<GetUserMsg["data"]["pagination"]>({
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
        await reqWhisper()
      },
    })
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
  isLoading.value = true
  const result = await getUserMsg({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  list.value = list.value.concat(result.list)
  pagination.value = result.pagination
  isLoading.value = false
  await initSendUser()
  cb?.()
}

const route = useRoute()
// 初始化用户发送消息 处理query.id不在list的id当中
const initSendUser = async () => {
  // 初始化过的退出
  if (init) return
  const id = route.query.id
  if (id && Number.isInteger(+id)) {
    // 是否存在id的用户
    const is = list.value.some((item) => item.user.id === +id)
    if (is) return
    // 不存在则查询和添加信息 到最开头
    try {
      const result = await userFindByPk(+id)
      if (!result) {
        ElMessage.warning(`没有查询到id为:${id}的用户`)
        router.replace("/user/msg?to=whisper")
        return
      }
      // 添加信息到最开始
      list.value.unshift({
        user: {
          account: result.account,
          avatar: result.avatar,
          id: result.id,
          nickName: result.nickName,
          signer: result.signer,
        },
      })
    } catch (error) {
      ElMessage.warning(`没有查询到id为:${id}的用户`)
      router.replace("/user/msg?to=whisper")
    }
  }
}
</script>

<style lang="scss" scoped>
.whisper-container {
  --whisper-border: 0.0625rem solid rgba(132, 132, 132, 0.133);
  .users-container {
    border-right: var(--whisper-border);
    .list-nav-item {
      transition: background var(--primary-during);
      &:hover {
        background-color: var(--msg-bg);
      }
      // 激活的样式
      &.active {
        background-color: var(--msg-bg);
      }
    }
    @include media(xs) {
      width: 70px;
      .nav-content {
        display: none;
      }
    }
  }
  .title {
    border-bottom: var(--whisper-border);
  }
}
</style>
