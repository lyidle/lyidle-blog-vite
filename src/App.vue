<template>
  <context-menu>
    <router-view></router-view>
  </context-menu>
</template>

<script setup lang="ts" name="App">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 引入utils
import { setTitleTip } from "@/utils/effect"
// 引入类型
const userStore = useUserStore()
const { setClickEffect, setEffectMove } = useSettingStore()
// 发起请求
onBeforeMount(async () => {
  await userStore.userMenuList()
})
onMounted(() => {
  // 初始化标题
  setTitleTip()
  // 初始化鼠标点击事件
  setClickEffect()
  // 初始化鼠标移动事件
  setEffectMove()
})
</script>

<style scoped lang="scss"></style>
