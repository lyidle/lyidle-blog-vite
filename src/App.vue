<template>
  <div>
    <context-menu>
      <router-view></router-view>
    </context-menu>
  </div>
</template>

<script setup lang="ts" name="App">
// 引入鼠标点击和移动特效
import { clickEffectFn, moveEffectFn } from "@/utils/effect"
// 引入仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 引入utils 设置网页标签信息 离开和回来
import { setTitleTip } from "@/utils/effect"

// 提取数据
const { reqUserMenuList } = useUserStore()
const { isDark, clickEffect, moveEffect } = storeToRefs(useSettingStore())

//初始化特效函数
const effectClick = new clickEffectFn()
const effectMove = new moveEffectFn()
watchEffect(() => {
  // 根据 isDark 的值来设置主题
  document.body.className = isDark.value ? "dark" : "light"

  // 初始化或卸载点击特效
  clickEffect.value ? effectClick.onMounted() : effectClick.onUnMounted()

  // 初始化或卸载移动特效
  moveEffect.value ? effectMove.onMounted() : effectMove.onUnMounted()
})
// 发起请求
onBeforeMount(async () => {
  await reqUserMenuList()
})
onMounted(() => {
  // 初始化标题
  setTitleTip()
})
</script>

<style scoped lang="scss"></style>
