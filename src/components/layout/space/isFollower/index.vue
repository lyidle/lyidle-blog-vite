<template>
  <!-- 是否关注和或者互粉 -->
  <my-button
    :type="isFollow ? 'default' : 'primary'"
    v-bind="$attrs"
    @click="toggleFollow"
    v-if="isFollow !== null"
  >
    <!-- 是否是互关 -->
    <template v-if="!isFollower && userInfo?.id === userId">
      {{ isFollow ? "已互关" : "回关" }}
    </template>
    <template v-else> {{ isFollow ? "已" : "" }}关注 </template>
    <!-- 是否是互粉 -->
  </my-button>
  <!-- 是自身 -->
  <my-button
    type="primary"
    v-bind="$attrs"
    v-else-if="isOwner"
    @click="handlerOwner"
  >
    关注
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
import { mitt } from "@/utils/emitter"
const {
  // 关注数
  followerCounts,
  // 用户信息
  userInfo,
} = storeToRefs(useUserSpaceStore())
// 得到本地 userId
const { userId } = storeToRefs(useUserStore())

const props = withDefaults(
  defineProps<{
    curId: number | undefined
    isFollower?: boolean
    isFollow?: boolean
  }>(),
  {
    isFollower: undefined,
    isFollow: undefined,
  }
)

// 是否 关注了
const isFollow = ref<boolean | null>(
  typeof props.isFollow === "boolean" ? props.isFollow : null
)
// 是否是自身
const isOwner = ref(false)
// 是否 关注了
const isFollowCallback = async () => {
  // 非法判断
  const id = props.curId
  if (typeof id !== "number") return
  if (!props.curId || !userId.value) return
  // 有 默认值了
  if (typeof props.isFollow === "boolean") return
  try {
    const result = await isFollowed(userId.value, props.curId)
    isFollow.value = result
    mitt.emit("isFollowUser", { userId: props.curId, is: isFollow.value })
  } catch (error: any) {
    // 查看是否是查询的自身
    if (error?.message?.some((item: string) => item.includes("不能查询自身"))) {
      isOwner.value = true
    }
  }
}

// 初始化是否关注
onMounted(isFollowCallback)

// 关注
const toFollow = async () => {
  // 非法判断
  const id = props.curId
  if (typeof id !== "number") return ElMessage("关注失败，id丢失")
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
  // 非法判断
  const id = props.curId
  if (typeof id !== "number") return ElMessage("取消关注失败，id丢失")
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
const toggleFollow = async () => {
  isFollow.value ? await toDelFollow() : await toFollow()
  mitt.emit("isFollowUser", { userId: props.curId, is: isFollow.value })
}

// 处理自身
const handlerOwner = () => ElMessage.warning("你时时刻刻都在关注你自己~~")
</script>

<style scoped></style>
