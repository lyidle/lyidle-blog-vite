<template>
  <global-avatar
    :isCenter="false"
    :isTo="false"
    :isCursor="false"
    v-bind="$attrs"
    :imgSrc="
      showAvatar()
        ? `url('${escapeUrlForRegExp(showAvatar())}')`
        : 'var(--default-avatar)'
    "
    style="--avatar-size: 80px"
  ></global-avatar>
</template>

<script setup lang="ts" name="AvatarSrc">
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取需要的数据
const { userAccount, userAvatar } = storeToRefs(useUserStore())
const props = defineProps<{ account: string; avatar: string | null }>()
// 计算 是否是 本地的用户
const showAvatar = () => {
  if (props.account === userAccount.value) return userAvatar.value
  return props.avatar
}
</script>

<style scoped lang="scss"></style>
