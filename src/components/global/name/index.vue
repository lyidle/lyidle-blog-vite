<template>
  <my-tooltip
    class="box-item"
    effect="dark"
    :content="`作者:${authAccount}`"
    placement="top"
  >
    <slot
      name="nick"
      :nick="authNickname"
      :account="authAccount"
      v-if="$slots.nick"
    ></slot>
    <div class="cur-text line-clamp-1" :class="$attrs.nickClass" v-else>
      {{ authNickname }}
    </div>
  </my-tooltip>
</template>

<script setup lang="ts" name="showNicknameAndAccount">
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取数据
const { userAccount, userNickName } = storeToRefs(useUserStore())

const props = defineProps<{
  account: string
  nick: string
}>()

const authAccount = computed(() =>
  props.account === userAccount.value ? userAccount.value : props.account
)
const authNickname = computed(() =>
  props.account === userAccount.value ? userNickName.value : props.nick
)
</script>

<style scoped></style>
