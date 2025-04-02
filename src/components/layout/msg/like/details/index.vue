<template>
  <div
    class="like-detail-container flex flex-col gap-[var(--gap-y)] h-100% relative"
  >
    <div class="msg-box p-[var(--p)] h-80px">
      <!-- 返回按钮 -->
      <my-anchor
        to="/user/msg?to=like"
        class="float-right w-50px h-35px ml-5px"
      >
        <my-button size="small">返回</my-button>
      </my-anchor>
      <!-- 评论 -->
      <div v-if="target?.type === 'comment'" class="text-justify line-clamp-3">
        <span>评论：</span>{{ decompressStringNotError(target.content || "") }}
      </div>
      <!-- 文章 -->
      <div v-if="target?.type === 'article'" class="text-justify line-clamp-3">
        <span>文章：《{{ target.title }}》</span>
        {{ decompressStringNotError(target.content || "") }}
      </div>
      <!-- 设置项的 页面 -->
      <div v-if="target?.type === 'setting'" class="text-justify line-clamp-3">
        <span>文章：</span>
        {{ decompressStringNotError(target.content || "") }}
      </div>
    </div>
    <!-- 具体的 用户 -->
    <div
      class="user-container msg-box max-h-70% flex flex-col gap-[var(--gap-y)] overflow-y-auto"
    >
      <div class="flex flex-col" v-for="item in likes" :key="item.id">
        {{ item.user.id }}
        <div class="p-15px flex gap-10px justify-between">
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
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="`作者:${item.user.account}`"
                placement="top"
              >
                <router-link
                  :to="`/user/space/${item.user.account}`"
                  class="!hover:color-[var(--primary-links-hover)] font-bold w-fit"
                >
                  <span class="max-w-100px line-clamp-1">
                    {{ item.user.nickName }}
                  </span>
                </router-link>
              </my-tooltip>
              <span class="cur-text">赞了我</span>
            </div>
            <!-- 时间 -->
            <div class="cur-text">
              {{ moment(item.updatedAt, "YYYY年MM月DD日 hh:mm") }}
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
    </div>
  </div>
</template>

<script setup lang="ts" name="UserMessageLikeDetails">
// 引入 api
import { getUserLikeDetails } from "@/api/user/msg"
// 引入 类型
import { likeQueryType } from "./types"
import { GetUserLikeDetails } from "@/api/user/msg/types/getUserLikeDetails"
import { GetUserLikeDetailsQuery } from "@/api/user/msg/types/getUserLikeDetailsQuery"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"

// 引入 类型

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

// 初始化 数据
const initLikes = async () => {
  // 判断 type 与 id 是否合法
  const va = validate()
  if (!va) return
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
  likes.value = result.likes
  target.value = result.target
}

// 初始化数据
onMounted(initLikes)

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
  // const { id, type } = va
})
</script>

<style scoped lang="scss">
.like-detail-container {
  position: relative;
}
</style>

<!-- 重新设置颜色 -->
<style lang="scss">
.msg-scene:has(.like-detail-container) {
  all: unset;
  width: 100%;
  height: 100%;
}
</style>
