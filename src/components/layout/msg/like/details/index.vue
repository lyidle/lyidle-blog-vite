<template>
  <div class="like-detail-container">
    <div class="msg-box p-[var(--p)]">
      <!-- 返回按钮 -->
      <my-anchor
        to="/user/msg?to=like"
        class="float-right w-50px h-35px ml-5px"
      >
        <my-button size="small">返回</my-button>
      </my-anchor>
      <my-anchor
        class="text-justify line-clamp-3"
        :to="
          target?.type === 'article' ? `/doc/${target.id}` : target?.link || ''
        "
      >
        <span
          >{{ target?.type === "comment" ? "评论" : "文章" }}：<span
            v-if="target?.title"
            >《{{ target.title }}》</span
          ></span
        >
        {{ decompressStringNotError(target?.content || "") }}
      </my-anchor>
    </div>
    <!-- 具体的 用户 -->
    <div class="msg-box flex flex-col overflow-y-auto flex-shrink-0">
      <div class="flex flex-col flex-shrink-0">
        <div
          v-for="item in likes"
          :key="item.id"
          class="user-items p-15px flex gap-10px justify-between"
        >
          <!-- 头像 -->
          <global-avatar-src
            :account="item.user.account"
            :avatar="item.user.avatar"
            :style="{ '--avatar-size': '50px' }"
            class="avatar flex-shrink-0"
          ></global-avatar-src>
          <!-- 中间部分信息 -->
          <div class="flex flex-col justify-center gap-10px flex-1">
            <!-- 名字 -->
            <div class="flex gap-10px">
              <global-name
                class="box-item"
                :account="item.user.account"
                :nick="item.user.nickName"
              >
                <template #nick="{ nick, account }">
                  <router-link
                    :to="`/user/space/${account}`"
                    class="!hover:color-[var(--primary-links-hover)] font-bold w-fit"
                  >
                    <span class="max-w-100px line-clamp-1">
                      {{ nick }}
                    </span>
                  </router-link>
                </template>
              </global-name>
              <span class="cur-text">赞了我</span>
            </div>
            <!-- 时间 -->
            <div class="cur-text">
              {{ moment(item.lastLikeAt, "YYYY年MM月DD日 hh:mm") }}
            </div>
          </div>
          <!-- 是否关注 -->
          <layout-space-is-follower
            class="w-fit"
            :curId="item.user.id"
            :isFollow="item.user.isFollow"
            size="small"
          ></layout-space-is-follower>
        </div>
      </div>
      <!-- loading -->
      <div
        ref="obEl"
        v-my-loading="() => ({ show: isLoading })"
        class="w-100% flex-shrink-0"
        :style="{ '--mask': '#0000', height: isLoading ? '100%' : '20px' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageLikeDetails">
// 引入 api
import { getUserLikeDetails } from "@/api/user/msg"
// 引入 类型
import type { likeQueryType } from "./types"
import type { GetUserLikeDetails } from "@/api/user/msg/types/getUserLikeDetails"
import type { GetUserLikeDetailsQuery } from "@/api/user/msg/types/getUserLikeDetailsQuery"
// 解压文本
import { decompressStringNotError } from "@/utils/compression"
// 处理时间
import moment from "@/utils/moment"
import { createIntersectionObserver } from "@/utils/observer"

const route = useRoute()
const router = useRouter()

// 请求的类型
const queryType: likeQueryType[] = ["article", "comment", "setting"]

const pagination = ref<GetUserLikeDetails["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

const likes = ref<GetUserLikeDetails["data"]["likes"]>([])
const target = ref<GetUserLikeDetails["data"]["target"]>()

const isLoading = ref(true)

// 初始化 数据
const reqLikeDetails = async () => {
  // 判断 type 与 id 是否合法
  const va = validate()
  if (!va) return
  // 判断是否超出
  if (init && pagination.value.total) {
    // 需要是 上次的 当前页 来进行判断是否加载下一页
    const is =
      (pagination.value.currentPage - 1) * pagination.value.pageSize <
      pagination.value.total
    if (is) {
      await reqLikeDetailsCallback()
    }
    return
  }

  // 初始化数据
  if (!init) {
    await reqLikeDetailsCallback(() => {
      init = true
    })
  }
}
const reqLikeDetailsCallback = async (cb?: () => void) => {
  // 判断 type 与 id 是否合法
  const va = validate()
  if (!va) return
  isLoading.value = true
  const { id, type } = va
  // 得到 对应的id
  const curId: GetUserLikeDetailsQuery = {}
  if (type === "article") curId.articleId = id
  if (type === "comment") curId.commentId = id
  if (type === "setting") curId.settingId = id
  const result = await getUserLikeDetails({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    ...curId,
  })
  pagination.value = result.pagination
  likes.value = likes.value.concat(result.likes)
  target.value = result.target
  cb?.()
  isLoading.value = false
}

// 初始化数据
let stopObserver: (() => void) | void
onBeforeUnmount(() => stopObserver?.())

let init = false
const obEl = ref<HTMLElement>()
onMounted(() => {
  // 初始化 交叉传感器，用于更新数据
  if (obEl.value)
    stopObserver = createIntersectionObserver(obEl.value, {
      enter: async () => {
        // 初始化 后 自增当前页
        if (init) ++pagination.value.currentPage
        await reqLikeDetails()
      },
    })
})

// 判断 type 与 id 是否合法
const validate = (): void | { id: number; type: likeQueryType } => {
  const id = Number.isInteger(+(route.query.id || NaN)) && +route.query.id!
  const type =
    queryType.includes(route.query.type as likeQueryType) &&
    (route.query.type as likeQueryType)

  // 非法判断
  if (!id || !type) {
    router.push("/user/msg?to=like")
    nextTick(() => ElMessage.warning("id或者type的值不合法"))
    return
  }
  return {
    id,
    type,
  }
}

watchEffect(async () => {
  // 判断 type 与 id 是否合法
  const va = validate()
  if (!va) return
})
</script>

<style scoped lang="scss">
.like-detail-container {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: 80px 1fr;
  gap: var(--gap-y);
  .user-items {
    border-bottom: 1px solid rgba(128, 128, 128, 0.703);
  }
}
</style>

<!-- 重置颜色 -->
<style lang="scss">
.msg-scene:has(.like-detail-container) {
  background-color: unset;
}
</style>
