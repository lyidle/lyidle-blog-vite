<template>
  <div v-if="userInfo?.id" class="color-[var(--primary-color)] w-100% h-100%">
    <div class="flex gap-10px">
      <!-- 头像 -->
      <global-avatar-src
        :account="userInfo.account"
        :avatar="userInfo.avatar"
        :style="{ '--avatar-size': '60px' }"
        class="flex-shrink-0"
      ></global-avatar-src>
      <!-- 左侧 -->
      <div class="flex flex-col gap-15px flex-1">
        <!-- 名字 -->
        <global-name :account="userInfo.account" :nick="userInfo.nickName">
          <template #nick="{ nick, account }">
            <router-link :to="`/user/space/${account}`" class="w-fit h-fit">
              <span
                class="text-20px hover:color-[var(--primary-links-hover)] line-clamp-1"
              >
                {{ nick }}
              </span>
            </router-link>
          </template>
        </global-name>
        <!-- 关注与粉丝等信息 -->
        <div class="flex flex-col gap-5px">
          <div class="flex gap-20px">
            <router-link
              :to="`/user/space/${userInfo.account}?to=follower&group=normal`"
              class="hover:color-[var(--primary-links-hover)]"
            >
              <div>{{ followerCounts || 0 }}关注</div>
            </router-link>
            <router-link
              :to="`/user/space/${userInfo.account}??to=following`"
              class="hover:color-[var(--primary-links-hover)]"
            >
              <div>{{ followingCounts || 0 }}粉丝</div>
            </router-link>

            <div class="cur-text">{{ likeCounts || 0 }}获赞</div>
          </div>
          <!-- 签名 -->
          <div class="cur-text line-clamp-1">
            {{ userInfo.signer || "这个人没有签名哦~~" }}
          </div>
        </div>
        <!-- 关注与发消息 -->
        <div class="flex gap-8px">
          <global-is-follower
            class="w-100px h-30px"
            :curId="userInfo.id"
            :toggleCb="toggleCb"
          ></global-is-follower>
          <router-link :to="`/user/msg?to=whisper&id=${userInfo?.id}`">
            <my-button class="p-0px w-100px h-30px pr-5px" type="default">
              <i class="i-mynaui:plus size-18px"></i>
              <span>发消息</span>
            </my-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="showUserInfo">
// 引入 api
import { userFindByPk } from "@/api/user"
import { getUserArticleLikes } from "@/api/user/counts"
import { getFollowerCounts, getFollowingCounts } from "@/api/user/follow"
// 引入 类型
import { UserFindByPk } from "@/api/user/types/userFindByPk"

const props = defineProps<{ userId: number }>()

const userInfo = ref<UserFindByPk["data"]>()

const reqUser = async () => {
  const userId = props.userId
  if (!userId || !Number.isInteger(+userId)) return
  const result = await userFindByPk(userId)
  userInfo.value = result
}

// 关注数
const followerCounts = ref(0)
// 粉丝数
const followingCounts = ref(0)
// 获赞量
const likeCounts = ref(0)

// 获取 关注数
const reqFollowers = async () => {
  // 非法判断
  if (!Number.isInteger(+props.userId)) return
  const counts = await getFollowerCounts(props.userId)
  followerCounts.value = counts || 0
}
// 获取 粉丝数
const reqFollowingCounts = async () => {
  // 非法判断
  if (!Number.isInteger(+props.userId)) return
  const counts = await getFollowingCounts(props.userId)
  followingCounts.value = counts || 0
}
// 获取 获赞量
const reqViewLikes = async () => {
  // 非法判断
  if (!Number.isInteger(+props.userId)) return
  const counts = await getUserArticleLikes(props.userId)
  likeCounts.value = counts || 0
}

const toggleCb = (is: boolean) => {
  if (is) {
    ++followingCounts.value
  } else --followingCounts.value
}

onMounted(async () => {
  await Promise.allSettled([
    reqUser(),
    reqFollowingCounts(),
    reqViewLikes(),
    reqFollowers(),
  ])
})
</script>

<style scoped></style>
