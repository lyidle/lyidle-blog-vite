<template>
  <div class="like-container flex flex-col p-10px gap-10px">
    <template v-for="item in likesData" :id="key">
      <!-- 每一项 -->
      <div class="like-item py-15px">
        <div class="flex justify-between">
          <!-- 头像 只要 前两个 -->
          <div class="avatar-single">
            <global-avatar-src
              :account="item.user?.account"
              :avatar="item.user?.avatar"
              :style="{ '--avatar-size': 'var(--size)' }"
              class="avatar flex-shrink-0"
            ></global-avatar-src>
          </div>
          <!-- 中间信息 -->
          <div class="flex-1 flex flex-col justify-center gap-10px">
            <!-- 名字 -->
            <div class="flex h-fit">
              <!-- 名字 只要 前两个  -->
              <my-tooltip
                class="box-item"
                effect="dark"
                :content="`作者:${item.user?.account}`"
                placement="top"
              >
                <div class="flex cur-text font-bold">
                  {{ item.user?.nickName }}
                </div>
              </my-tooltip>
              <my-anchor
                :to="
                  item.articleId
                    ? `/doc/${item.articleId}`
                    : item.settingId
                    ? '/person/about'
                    : ''
                "
                class="ml-10px !hover:color-[var(--primary-links-hover)] cur-pointer"
              >
                赞了我的{{ item.comment?.id ? "评论" : "文章" }}
              </my-anchor>
            </div>
            <!-- 时间等信息 -->
            <div class="cur-text text-15px">
              {{
                moment(
                  item.article?.updatedAt ||
                    item.comment?.updatedAt ||
                    item.setting?.updatedAt,
                  "YYYY年MM月DD日 hh:mm"
                )
              }}
            </div>
          </div>
          <div class="m-5px w-100px cur-text line-clamp-2">
            {{
              item.article?.title ||
              item.setting?.name ||
              decompressStringNotError(item.comment?.content || "")
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
import { GetUserLikes } from "@/api/user/msg/types/getUserLikes"
import { decompressStringNotError } from "@/utils/compression"
import moment from "@/utils/moment"
import { createIntersectionObserver } from "@/utils/observer"

const pagination = ref<GetUserLikes["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

const isLoading = ref(true)

// 存储 数据
const likesData = ref<GetUserLikes["data"]["likes"]>([])

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
  likesData.value = likesData.value.concat(data.likes)
  pagination.value = data.pagination
  cb?.()
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
