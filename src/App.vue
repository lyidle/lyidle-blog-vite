<template>
  <context-menu>
    <layout-theme></layout-theme>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </context-menu>
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
const {
  isDark,
  themes,
  clickEffect,
  moveEffect,
  bannerIsFixed,
  scrollSave,
  lights,
  darks,
  clicks,
  moves,
} = storeToRefs(useSettingStore())
//初始化特效函数
const effectClick = new clickEffectFn()
const effectMove = new moveEffectFn()
// 主题切换
const prefers = matchMedia("(prefers-color-scheme: dark)")

// 监听 isDark themes 为 switch时监听
watch(
  () => isDark.value,
  (newV) => {
    // 根据 isDark 的值来设置主题
    document.documentElement.setAttribute(
      "themes",
      newV ? darks.value + "-dark" : lights.value + "-light"
    )
  },
  {
    immediate: true,
  }
)

// 跟随系统 切换主题
const follow = () => {
  prefers.matches ? (isDark.value = true) : (isDark.value = false)
}

// 监听 themes
watch(
  () => themes.value,
  (newV) => {
    if (newV === "switch") return
    // 跟随系统切换
    if (newV === "auto") {
      follow()
      prefers.addEventListener("change", follow)
      return
    }
    prefers.removeEventListener("change", follow)
    newV === "light" ? (isDark.value = false) : (isDark.value = true)
  },
  {
    immediate: true,
  }
)
// 监听 bannerIsFixed
watch(
  () => bannerIsFixed.value,
  (newV) => {
    // 根据 监听 的值来设置主题
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
    watch(
      () => clicks.value,
      (newV) => {
        if (newV === "normal")
          newVal ? effectClick.onMounted() : effectClick.onUnMounted()
      },
      {
        immediate: true,
      }
    )
  },
  {
    immediate: true,
  }
)
// 监听 moveEffect
watch(
  () => moveEffect.value,
  (newVal) => {
    watch(
      () => moves.value,
      (newV) => {
        if (newV === "normal")
          newVal ? effectMove.onMounted() : effectMove.onUnMounted()
      },
      {
        immediate: true,
      }
    )
  },
  {
    immediate: true,
  }
)

// 记录滚动 的位置
const initScrollSave = () => {
  scrollSave.value = {
    to: document.documentElement.scrollTop,
    route: window.location.pathname,
    height: document.documentElement.offsetHeight,
  }
}

// 发起请求
onBeforeMount(async () => {
  await reqUserMenuList()
})
onMounted(() => {
  // 初始化标题
  setTitleTip()
  // 监听 页面刷新 后 的事件 保留 一些位置信息
  window.addEventListener("unload", initScrollSave)
  // 初始化 位置 信息
  if (scrollSave.value?.route === window.location.pathname) {
    // 超时时间
    const timeout = 5
    // 得到的和保存的误差值
    const gap = 50
    const now = Date.now()
    const timer = setInterval(() => {
      // 超时也 清除定时器
      if ((Date.now() - now) / 1000 > timeout) {
        clearInterval(timer)
      }
      if (scrollSave.value?.height)
        if (
          Math.abs(
            document.documentElement.offsetHeight - scrollSave.value?.height
          ) <= gap
        ) {
          window.scrollTo({ top: scrollSave?.value?.to, behavior: "smooth" })
          clearInterval(timer)
        }
    }, 500)
  }
})
</script>

<style scoped lang="scss"></style>
