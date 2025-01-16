<template>
  <context-menu>
    <layout-theme></layout-theme>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </context-menu>
</template>

<script setup lang="ts" name="App">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 引入utils 设置网页标签信息 离开和回来
import { setTitleTip } from "@/utils/effect"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入鼠标点击和移动特效
import { clickEffectFn, moveEffectFn } from "@/utils/effect"
// 引入 全局的事件 变更
import { useGlobalEmitter } from "./globalEmitter"
// 全局的 监听事件 使用 mitt 管理
useGlobalEmitter()

// 提取数据
const { reqUserMenuList } = useUserStore()

const { isDark, themes, clickEffect, moveEffect, lights, darks } = storeToRefs(
  useSettingStore()
)
const { updateScrollDirection } = useSettingStore()
// 根据 isDark 的值来设置主题
mitt.on("isDark", () => {
  document.documentElement.setAttribute(
    "themes",
    isDark.value ? darks.value + "-dark" : lights.value + "-light"
  )
})

// 跟随系统 切换主题
const prefers = matchMedia("(prefers-color-scheme: dark)")
const follow = () => {
  prefers.matches ? (isDark.value = true) : (isDark.value = false)
}

// 切换主题
const switchThemes = () => {
  // 使用按钮切换
  if (themes.value === "switch") return
  // 跟随系统切换
  if (themes.value === "auto") {
    follow()
    prefers.addEventListener("change", follow)
    return
  }
  // 判断是暗夜与否
  prefers.removeEventListener("change", follow)
  themes.value === "light" ? (isDark.value = false) : (isDark.value = true)
}

// 全局 的 mitt 事件 不需要卸载

// 订阅 主题切换 事件
mitt.on("themes", switchThemes)

// 订阅 焦点图是否 固定事件
mitt.on("bannerIsFixed:true", () => {
  // 根据 监听 的值来设置主题
  document.body.setAttribute("banner-fixed", "fixed")
})
mitt.on("bannerIsFixed:false", () => {
  // 根据 监听 的值来设置主题
  document.body.setAttribute("banner-fixed", "")
})

// 订阅 鼠标点击效果事件
mitt.on("clickEffect:normal", (cb) => {
  //初始化特效函数
  const store = new clickEffectFn()
  cb(store)
  // 挂载 对应点击特效
  clickEffect.value ? store.onMounted() : store.onUnMounted()
})

// 订阅 鼠标 移动事件
mitt.on("moveEffect:normal", (cb: any) => {
  //初始化特效函数
  const store = new moveEffectFn()
  cb(store)
  // 挂载 对应点击特效
  moveEffect.value ? store.onMounted() : store.onUnMounted()
})

// 监听滚动事件
window.addEventListener("scroll", () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop
  updateScrollDirection(currentScrollTop) // 更新滚动状态
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
