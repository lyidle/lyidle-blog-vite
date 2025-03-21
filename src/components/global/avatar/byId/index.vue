<template>
  <global-avatar
    :isCenter="false"
    :isTo="false"
    :isCursor="false"
    v-bind="$attrs"
    :imgSrc="
      showAvatar
        ? `url('${escapeUrlForRegExp(showAvatar)}')`
        : 'var(--default-avatar)'
    "
    style="--avatar-size: 60px"
  ></global-avatar>
  <slot :userInfo="userInfo"></slot>
</template>

<script setup lang="ts" name="AvatarById">
// 引入 请求
import { userFindByPk } from "@/api/user"
// 引入 类型
import type { UserFindByPk } from "@/api/user/types/userFindByPk"
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取需要的数据
const { userAccount, userAvatar } = storeToRefs(useUserStore())

const props = defineProps<{ id: number }>()

// 存储 用户信息
const userInfo = ref<UserFindByPk["data"]>()

// 计算 是否是 本地的用户
const showAvatar = computed(() => {
  if (userInfo.value?.account === userAccount.value) return userAvatar.value
  return userInfo.value?.avatar
})

// 发起 请求
const reqUser = async () => {
  const userId = props.id
  if (!userId) return
  try {
    const result = await userFindByPk(userId)
    userInfo.value = result
  } catch (error) {
    console.error("评论区，查询用户信息失败")
  }
}
onMounted(async () => {
  if (!props.id) return
  await reqUser()
})
</script>

<style scoped lang="scss"></style>
