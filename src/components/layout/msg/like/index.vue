<template>
  <!-- 没有 id时显示 信息 -->
  <div class="msg-like-container" v-show="!$route.query.id">
    <div class="like-container flex flex-col gap-0.625rem">
      <template
        v-for="item in likesData"
        :id="`${item.type}:${
          item.articleId || item.settingId || item.commentId
        }`"
      >
        <!-- 每一项 -->
        <div class="like-item p-[var(--p)]">
          <div class="flex justify-between">
            <!-- 头像 只要 前两个 -->
            <div :class="item.likeCount > 1 ? 'avatars' : 'avatar-single'">
              <template v-for="(user, i) in item.recentLikers" :key="user.id">
                <global-avatar-src
                  :account="user.account"
                  :avatar="user.avatar"
                  :isCenter="item.likeCount == 1 ? true : false"
                  :style="{ '--avatar-size': 'var(--size)' }"
                  class="avatar flex-shrink-0"
                  v-if="i < 2"
                ></global-avatar-src>
              </template>
            </div>
            <!-- 中间信息 -->
            <div
              class="flex-1 flex flex-col justify-center gap-0.625rem ml-0.3125rem"
            >
              <!-- 名字 -->
              <div class="flex h-fit">
                <template v-for="(user, i) in item.recentLikers" :key="user.id">
                  <!-- 名字 只要 前两个  -->

                  <global-name
                    class="box-item"
                    :account="user.account"
                    :nick="user.nickName"
                    placement="top"
                    v-if="i < 2"
                  >
                    <template #nick="{ nick, account }">
                      <router-link
                        :to="`/user/space/${account}`"
                        class="!hover:color-[var(--primary-links-hover)] font-bold"
                        ><span class="max-w-6.25rem line-clamp-1"
                          >{{ nick }}
                        </span>
                      </router-link>
                    </template>
                  </global-name>
                  <span v-if="i < 1 && item.likeCount > 1">、</span>
                </template>
                <my-anchor
                  :to="
                    item.type === 'article'
                      ? `/doc/${item.articleId}`
                      : item.link || ''
                  "
                  class="ml-0.625rem !hover:color-[var(--primary-links-hover)] cur-pointer"
                >
                  等总计<span>{{ item.likeCount }}</span
                  >人赞了我的{{ item.type === "comment" ? "评论" : "文章" }}
                </my-anchor>
              </div>
              <div class="flex gap-0.625rem text-0.9375rem">
                <!-- 时间等信息 -->
                <div class="cur-text">
                  {{ moment(item.lastLikeAt, "YYYY年MM月DD日 hh:mm") }}
                </div>
                <div class="flex gap-0.4375rem">
                  <!-- 查看 -->
                  <my-anchor
                    :to="
                      item.type === 'article'
                        ? `/doc/${item.articleId}`
                        : item.link || ''
                    "
                    class="!hover:color-[var(--primary-links-hover)] msg-tools flex gap-0.1875rem items-center"
                  >
                    <i
                      class="i-lsicon:view-outline w-0.9375rem h-0.9375rem translate-y-0.0625rem"
                    ></i>
                    <span>查看</span>
                  </my-anchor>
                  <my-anchor
                    class="!hover:color-[var(--primary-links-hover)] msg-tools flex gap-0.1875rem items-center cur-pointer"
                    :to="
                      $route.fullPath +
                      `&id=${
                        item.type === 'article'
                          ? item.articleId
                          : item.type == 'setting'
                          ? item.settingId
                          : item.type === 'comment'
                          ? item.commentId
                          : ''
                      }&type=${item.type}`
                    "
                  >
                    <i
                      class="i-material-symbols-light:list-alt-outline w-0.9375rem h-0.9375rem"
                    ></i>
                    <span>详情</span>
                  </my-anchor>
                </div>
              </div>
            </div>
            <div
              class="m-0.3125rem w-6.25rem h-2.1875rem cur-text line-clamp-2"
            >
              {{
                item.title ||
                item.name ||
                decompressStringNotError(item.content || "")
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
      :style="{ '--mask': '#0000', height: isLoading ? '100%' : '0.625rem' }"
    ></div>
  </div>
  <layout-msg-like-details v-if="$route.query.id"></layout-msg-like-details>
</template>

<script setup lang="ts" name="UserMessageLike">
// 引入 api
import { getUserLikes } from "@/api/user/msg"
// 引入 类型
import { GetUserLikes } from "@/api/user/msg/types/getUserLikes"
// 解压文本
import { decompressStringNotError } from "@/utils/compression"
// 时间处理
import moment from "@/utils/moment"
// 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"

const normalSize = 4
const pagination = ref<GetUserLikes["data"]["pagination"]>({
  currentPage: 1,
  pageSize: normalSize,
})

const isLoading = ref(true)

// 存储 数据
const likesData = ref<GetUserLikes["data"]["likes"]>([])
let preItemLen = normalSize

// 初始化 数据
const reqLikes = async () => {
  // 判断是否超出
  if (init && pagination.value.total) {
    // 需要是 上次的 当前页 来进行判断是否加载下一页
    const is =
      (pagination.value.currentPage - 1) * pagination.value.pageSize <
        pagination.value.total && preItemLen >= pagination.value.pageSize
    if (is) {
      await reqLikesCallback()
    }
    return
  }
  // 初始化数据
  if (!init) {
    await reqLikesCallback(() => {
      init = true
    })
  }
}

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
        await reqLikes()
      },
    })
})
// 初始化数据的回调函数
const reqLikesCallback = async (cb?: () => void) => {
  isLoading.value = true
  const data = await getUserLikes({
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })
  likesData.value = likesData.value.concat(data.items)
  pagination.value = data.pagination
  preItemLen = data.items.length
  cb?.()
  isLoading.value = false
}
</script>

<style scoped lang="scss">
.like-container {
  $avatar-size: 2.5rem;
  > .like-item {
    border-bottom: 0.0625rem solid rgba(128, 128, 128, 0.703);
    // 两个的 头像
    .avatars {
      position: relative;
      width: $avatar-size * 1.8;
      height: $avatar-size + 0.625rem;
      > .avatar {
        --size: #{$avatar-size};
        &:nth-of-type(2) {
          position: absolute;
          right: 0.3125rem;
          bottom: 0;
          border: 0.0625rem solid rgba(128, 128, 128, 0.292);
        }
      }
    }
    .avatar-single {
      width: $avatar-size * 1.8;
      > .avatar {
        --size: 3.125rem;
      }
    }
  }
}
</style>
