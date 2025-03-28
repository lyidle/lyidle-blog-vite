<template>
  <div class="context-container">
    <!-- 头部 -->
    <header class="flex justify-between">
      <!-- 标题 -->
      <div class="title text-24px font-bold">{{ title }}</div>
      <!-- 操作按钮 -->
      <div class="btns">
        <my-button type="default" v-if="userId === userInfo?.id"
          >批量操作</my-button
        >
      </div>
    </header>
    <!-- 工具栏 -->
    <div
      class="flex justify-between mt-[var(--gap-y)]"
      v-if="userId === userInfo?.id"
    >
      <!-- 操作按钮 -->
      <div class="btns"></div>
      <!-- 搜索 -->
      <div class="relative w-200px">
        <my-input v-model="searchKey" placeholder="请输入关键词"> </my-input>
        <i
          class="i-weui:search-outlined w-20px h-20px absolute right-10px top-0 cur-pointer"
        ></i>
      </div>
    </div>
    <!-- 用户展示 -->
    <div
      class="userInfo"
      :style="{ '--item-width': isAside ? '280px' : '270px' }"
    >
      <div class="user flex gap-20px" v-for="user in users" :key="user.id">
        <!-- 头像 -->
        <router-link :to="`/user/space/${user.account}`">
          <global-avatar-src
            :account="user.avatar"
            :avatar="user.avatar"
            style="--avatar-size: 80px"
          ></global-avatar-src>
        </router-link>
        <!-- 用户信息 -->
        <div class="flex flex-col justify-between">
          <my-tooltip
            class="box-item"
            effect="dark"
            :content="`作者:${user.id === userId ? userAccount : user.account}`"
            placement="top"
          >
            <div class="text-17px cur-pointer w-fit">{{ user.nickName }}</div>
          </my-tooltip>
          <div class="text-13px cur-text">
            {{ user.signer || "这个人没有简介哦~~" }}
          </div>
          <div class="flex items-center gap-5px">
            <layout-space-is-follower
              class="w-70px"
              :curId="user.id"
              :isFollower
            ></layout-space-is-follower>
            <i
              class="i-ant-design:more-outlined w-20px h-20px cur-pointer opacity-0 more"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <my-pagination
      background
      layout="prev, pager, next, sizes"
      :total="pagination.total"
      :page-sizes="[10, 20, 30]"
      @change="reqUsers"
      class="justify-center mt-[var(--gap-y)]"
    />
  </div>
</template>

<script setup lang="ts" name="UserSpaceFollowerGroup">
// 引入 接口
import { getFollower, getFollowing } from "@/api/user/follow"
// 类型
import type { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
const {
  // 关注数
  followerCounts,
  // 粉丝数
  followingCounts,
  // 用户信息
  userInfo,
} = storeToRefs(useUserSpaceStore())
// 得到本地 userId
const { userId, userAccount } = storeToRefs(useUserStore())
const { isAside } = storeToRefs(useSettingStore())

const props = defineProps<{
  title: string
  group?: string
  isFollower?: boolean
}>()

// 分页数据
const pagination = ref<GetFollowUser["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 用户 数据
const users = ref<GetFollowUser["data"]["users"]>()

// 搜索的key
const searchKey = ref<string>("")

// 请求函数
const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
  if (!userInfo.value) return
  let result: GetFollowUser["data"] | null = null
  // 是否是关注
  if (props.isFollower) {
    result = await getFollower({
      userId: userInfo.value.id,
      total: followerCounts.value || 0,
      currentPage: currentPage || pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
  } else {
    // 是否是粉丝
    result = await getFollowing({
      userId: userInfo.value.id,
      total: followingCounts.value || 0,
      currentPage: currentPage || pagination.value.currentPage,
      pageSize: pageSize || pagination.value.pageSize,
    })
  }
  users.value = result.users
  pagination.value = result.pagination
}

// 用于判断是否第一次 监听过
let hasWatched = false
// 监听 followerCounts 数量
const stop = watchEffect(async () => {
  // 没有初始化
  if (typeof userInfo.value?.id !== "number") return
  if (followingCounts.value === null && followerCounts.value === null) return
  // 只发起一次请求
  try {
    stop()
  } catch (error) {
    hasWatched = true
  }
  await reqUsers()
})
if (hasWatched) {
  stop()
}
</script>

<style scoped lang="scss">
.context-container {
  --gap-y: 20px;
  height: 100%;
  > .userInfo {
    display: grid;
    margin-top: var(--gap-y);
    gap: 40px;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, var(--item-width));
    > .user {
      &:hover {
        .more {
          opacity: 1;
        }
      }
    }
  }
}
</style>
