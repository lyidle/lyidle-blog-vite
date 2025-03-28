<template>
  <my-button
    :type="isFollow ? 'default' : 'primary'"
    v-bind="$attrs"
    @click="toggleFollow"
  >
    <!-- 是否是互关 -->
    <template v-if="!isFollower && userInfo?.id === userId">
      {{ isFollow ? "已互关" : "回关" }}
    </template>
    <template v-else> {{ isFollow ? "已" : "" }}关注 </template>
    <!-- 是否是互粉 -->
  </my-button>
</template>

<script setup lang="ts" name="UserPsaceIsFollowered">
// 引入 接口
import { addFollow, delFollow, isFollowed } from "@/api/user/follow"
// 处理错误信息
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"
import { useUserStore } from "@/store/user"
const {
  // 关注数
  followerCounts,
  // 用户信息
  userInfo,
} = storeToRefs(useUserSpaceStore())
// 得到本地 userId
const { userId } = storeToRefs(useUserStore())

const props = defineProps<{ curId: number; isFollower?: boolean }>()

// 是否 关注了
const isFollow = ref(false)
// 是否 关注了
const isFollowCallback = async () => {
  if (!props.curId || !userId) return
  const result = await isFollowed(userId.value, props.curId)
  isFollow.value = result
}

// 初始化是否关注
onMounted(isFollowCallback)

// 关注
const toFollow = async () => {
  const id = props.curId
  if (!id) return ElMessage("关注失败，id丢失")
  try {
    await addFollow(id)
    isFollow.value = true
    // 是否是本地的 是的话增减 关注
    if (userInfo.value?.id === userId.value) {
      const counts = (followerCounts.value || 0) + 1
      followerCounts.value = counts
    }
    ElMessage.success("关注成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("关注失败")
  }
}

// 取消关注
const toDelFollow = async () => {
  const id = props.curId
  if (!id) return ElMessage("取消关注失败，id丢失")
  try {
    await delFollow(id)
    isFollow.value = false
    // 是否是本地的 是的话增减 关注
    if (userInfo.value?.id === userId.value) {
      const counts = (followerCounts.value || 0) - 1

      followerCounts.value = counts >= 0 ? counts : 0
    }
    ElMessage.success("取消关注成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("取消关注失败")
  }
}

// 聚合 关注和取消关注
const toggleFollow = async () =>
  isFollow.value ? await toDelFollow() : await toFollow()
</script>

<style scoped></style>
