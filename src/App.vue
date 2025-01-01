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
const { isDark, clickEffect, moveEffect, bannerIsFixed } = storeToRefs(
  useSettingStore()
)

//初始化特效函数
const effectClick = new clickEffectFn()
const effectMove = new moveEffectFn()
// 监听 isDark
watch(
  () => isDark.value,
  (newV) => {
    // 根据 isDark 的值来设置主题
    document.documentElement.setAttribute("themes", newV ? "dark" : "light")
  },
  {
    immediate: true,
  }
)
// 监听 bannerIsFixed
watch(
  () => bannerIsFixed.value,
  (newV) => {
    // 根据 isDark 的值来设置主题
    document.body.setAttribute("banner-fixed", newV ? "fixed" : "")
  },
  {
    immediate: true,
  }
)
// 监听 clickEffect
watch(
  () => clickEffect.value,
  (newVal) => {
    newVal ? effectClick.onMounted() : effectClick.onUnMounted()
  },
  {
    immediate: true,
  }
)
// 监听 moveEffect
watch(
  () => moveEffect.value,
  (newVal) => {
    newVal ? effectMove.onMounted() : effectMove.onUnMounted()
  },
  {
    immediate: true,
  }
)
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
