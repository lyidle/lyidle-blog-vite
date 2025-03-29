<template>
  <layout-content ref="layoutRef">
    <template #content-start>
      <my-card class="card_style allDocs">
        <!-- 头部 -->
        <layout-space-header
          :account
          v-model:signer="signer"
          v-model:userInfo="userInfo"
        ></layout-space-header>
        <!-- 分割线 -->
        <global-animations-ribbon
          bg="var(--primary-color)"
          class="mt-15px"
        ></global-animations-ribbon>
        <layout-space-scene
          :userId="userInfo?.id"
          v-if="userInfo?.id"
        ></layout-space-scene>
        <layout-space-scene :userId="userInfo?.id" v-else></layout-space-scene>
        <!-- 主页 -->
        <layout-space-home
          v-if="scene === 'home'"
          v-model:layoutRef="layoutRef"
          :account
        ></layout-space-home>
        <!-- 收藏 -->
        <layout-space-home
          v-if="scene === 'collect'"
          v-model:layoutRef="layoutRef"
          :account
        ></layout-space-home>
        <!-- 关注 -->
        <layout-space-follow
          v-if="scene === 'follower' || scene === 'following'"
          :account
        ></layout-space-follow>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="UserSpace">
// 引入 api
import { searchCounts } from "@/api/user"
// 处理错误信息
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"

// 得到 布局组件的实例
const layoutRef = ref()
const { scene, userInfo } = storeToRefs(useUserSpaceStore())

// 得到 账号名
const route = useRoute()
const account = route.params.author as string

// 得到 用户的信息
const reqUserInfo = async () => {
  // 每次 请求时 重置
  userInfo.value = undefined
  if (!account) return
  try {
    const result = await searchCounts({ isBin: "true", account })
    userInfo.value = result?.[0]
    signer.value = userInfo.value?.signer || ""
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage("获取用户信息失败")
  }
}

// 签名
const signer = ref("")

onMounted(async () => {
  await reqUserInfo()
})
</script>
<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle;
.allDocs {
  padding: 20px;
}
</style>
