<template>
  <!-- 是否关注和或者互粉 -->
  <my-button
    :type="isFollow ? 'default' : 'primary'"
    v-bind="$attrs"
    @click="toggleFollow"
    v-if="!isOwner"
  >
    {{ isFollow ? "已" : "" }}关注
  </my-button>
  <my-button type="primary" v-bind="$attrs" v-else @click="handlerOwner">
    关注
  </my-button>
</template>

<script setup lang="ts" name="UserPsaceIsFollowered">
// 引入 接口
import { addFollow, delFollow, isFollowed } from "@/api/user/follow"
// 处理错误信息
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 得到本地 userId
const { userId } = storeToRefs(useUserStore())

const props = withDefaults(
  defineProps<{
    curId: number | undefined
    toggleCb?: (is: boolean) => void
  }>(),
  {}
)

// 是否 关注了
const isFollow = ref<boolean | null>()
// 是否是自身
const isOwner = ref(false)
// 是否 关注了
const isFollowCallback = async () => {
  // 非法判断
  const id = props.curId
  if (typeof id !== "number") return
  if (!props.curId || !userId.value) return
  if (+props.curId === +userId.value) return (isOwner.value = true)
  try {
    const result = await isFollowed(userId.value, props.curId)
    isFollow.value = result
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
    ElMessage.success("关注成功")
    return true
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
    ElMessage.success("取消关注成功")
    return true
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("取消关注失败")
  }
}

// 聚合 关注和取消关注
const toggleFollow = async () => {
  const result = isFollow.value ? await toDelFollow() : await toFollow()
  if (result) props.toggleCb?.(isFollow.value || false)
}

// 处理自身
const handlerOwner = () => ElMessage.warning("你时时刻刻都在关注你自己~~")
</script>

<style scoped></style>
