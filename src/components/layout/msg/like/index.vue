<template>
  <div class="like-container flex flex-col p-10px gap-10px">
    <template v-for="(value, key) in likesData" :id="key">
      <!-- 每一项 -->
      <div class="like-item py-15px">
        <div class="flex justify-between">
          <!-- 头像 只要 前两个 -->
          <div :class="value.users.length > 1 ? 'avatars' : 'avatar-single'">
            <template v-for="(user, i) in value.users" :key="user.id">
              <global-avatar-src
                :account="user.account"
                :avatar="user.avatar"
                :style="{ '--avatar-size': 'var(--size)' }"
                class="avatar flex-shrink-0"
                v-if="i < 2"
              ></global-avatar-src>
            </template>
          </div>
          <!-- 中间信息 -->
          <div class="flex-1 flex flex-col justify-center gap-10px">
            <!-- 名字 -->
            <div class="flex h-fit">
              <template v-for="(user, i) in value.users" :key="user.id">
                <!-- 名字 只要 前两个  -->
                <my-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`作者:${user.account}`"
                  placement="top"
                  v-if="i < 2"
                >
                  <div class="flex cur-text font-bold">
                    {{ user.nickName }}
                    <span v-if="i < 1 && value.users.length > 1">、</span>
                  </div>
                </my-tooltip>
              </template>
              <my-anchor
                :to="
                  value.type === 'article'
                    ? `/doc/${value.data.id}`
                    : value.type == 'setting' && value.data.name === '关于'
                    ? '/person/about'
                    : value.type === 'comment'
                    ? value.data.link
                    : ''
                "
                class="ml-10px !hover:color-[var(--primary-links-hover)] cur-pointer"
              >
                等总计<span>{{ value.users.length }}</span
                >人赞了我的{{ value.type === "comment" ? "评论" : "文章" }}
              </my-anchor>
            </div>
            <!-- 时间等信息 -->
            <div class="cur-text">{{ moment(value.data.updatedAt) }}</div>
          </div>
          <div class="m-5px w-100px cur-text line-clamp-2">
            {{
              value.data.name ||
              value.data.title ||
              decompressStringNotError(value.data.content)
            }}
          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- loading -->
  <div
    ref="obEl"
    v-my-loading="() => ({ show: isLoading })"
    class="w-100%"
    :style="{ '--mask': '#0000', height: isLoading ? '100%' : '20px' }"
  ></div>
</template>

<script setup lang="ts" name="UserMessageLike">
// 引入 api
import { getUserLikes } from "@/api/user/msg"
import {
  GetUserLikes,
  Article,
  Setting,
  User,
  Comment,
} from "@/api/user/msg/types/getUserLikes"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"
import { createIntersectionObserver } from "@/utils/observer"

const pagination = ref<GetUserLikes["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

const isLoading = ref(true)

// 类型 申明
type likesDataValueType = {
  data: Article | Setting | Comment
  type: "article" | "setting" | "comment"
  users: User[]
}
type likesDataType = {
  [key in string]: likesDataValueType
}
// 存储 数据
const likesData = ref<likesDataType>()

let init = false

// 初始化 数据
const reqLikes = async () => {
  isLoading.value = true
  // 判断是否超出
  if (init && pagination.value.total) {
    const is =
      pagination.value.total -
        pagination.value.currentPage * pagination.value.pageSize >
      0
    if (is) {
      await reqLikesCallback()
    }
    isLoading.value = false
    return
  }

  // 初始化数据
  if (!init) {
    await reqLikesCallback(() => {
      init = true
      isLoading.value = false
    })
  }
}

const obEl = ref<HTMLElement>()
onMounted(() => {
  // 初始化 交叉传感器，用于更新数据
  if (obEl.value)
    createIntersectionObserver(obEl.value, {
      enter: async () => {
        // 初始化 后 自增当前页
        if (init) ++pagination.value.currentPage
        await reqLikes()
      },
    })
})

// 初始化数据的回调函数
const reqLikesCallback = async (cb?: () => void) => {
  const data = await getUserLikes({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  console.log(data, pagination.value.currentPage)
  likesData.value = Object.assign(
    likesData.value || {},
    processLikes(data.likes)
  )
  pagination.value = data.pagination
  ElMessage("enter")
  cb?.()
}

// 处理 数据 为需要的 计数和分类
const processLikes = (likes: GetUserLikes["data"]["likes"]) => {
  const likesData: any = new Map<string, likesDataValueType>()
  likes.forEach((item) => {
    // 用户信息
    const user = item.user
    // 没有用户退出
    if (!user) return
    // 文章
    const article = item.article
    // 设置
    const setting = item.setting
    // 评论
    const comment = item.comment

    // 文章
    if (article) {
      const key = `article:${article.id}`
      const cache = likesData.get(key)
      // 没有缓存 则创建
      if (!cache)
        return likesData.set(key, {
          data: article,
          type: "article",
          users: [user],
        } as likesDataValueType)
      // 有缓存 则添加
      cache.data = article
      if (!cache.users.find((item: User) => item.id == user.id))
        cache.users.push(user)
    }
    // 设置
    if (setting) {
      const key = `setting:${setting.id}`
      const cache = likesData.get(key)
      // 没有缓存 则创建
      if (!cache)
        return likesData.set(key, {
          data: setting,
          type: "setting",
          users: [user],
        } as likesDataValueType)
      // 有缓存 则添加
      cache.data = setting
      if (!cache.users.find((item: User) => item.id == user.id))
        cache.users.push(user)
    }
    // 处理 评论
    if (comment) {
      const key = `setting:${comment.id}`
      const cache = likesData.get(key)
      // 没有缓存 则创建
      if (!cache)
        return likesData.set(key, {
          data: comment,
          type: "comment",
          users: [user],
        } as likesDataValueType)
      // 有缓存 则添加
      cache.data = comment
      if (!cache.users.find((item: User) => item.id == user.id))
        cache.users.push(user)
    }
  })

  return Object.fromEntries(likesData) as likesDataType
}
</script>

<style scoped lang="scss">
.like-container {
  $avatar-size: 40px;
  > .like-item {
    border-bottom: 1px solid red;
    // 两个的 头像
    .avatars {
      position: relative;
      width: $avatar-size * 1.8;
      height: $avatar-size + 10px;
      > .avatar {
        --size: #{$avatar-size};
        &:nth-of-type(2) {
          position: absolute;
          right: 5px;
          bottom: 0;
          border: 1px solid red;
        }
      }
    }
    .avatar-single {
      width: $avatar-size * 1.8;
      display: flex;
      justify-content: center;
      align-items: center;
      > .avatar {
        --size: 50px;
      }
    }
  }
}
</style>
