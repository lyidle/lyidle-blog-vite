// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
export const useSwitchThemes = () => {
  // 提取数据
  const { isDark, themes, lights, darks } = storeToRefs(useSettingStore())

  // 根据 isDark 的值来设置主题
  const setTheme = () => {
    document.documentElement.setAttribute(
      "themes",
      isDark.value ? darks.value + "-dark" : lights.value + "-light"
    )
  }
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

  // 订阅暗夜切换
  mitt.on("isDark", setTheme)
  // 订阅 主题切换 事件
  mitt.on("themes", switchThemes)

  // 监听 isDark
  watch(
    () => isDark.value,
    (newV) => {
      // 统一触发
      mitt.emit("isDark", newV)
    },
    {
      immediate: true,
    }
  )

  // 监听 themes
  watch(
    () => themes.value,
    (newV) => {
      mitt.emit("themes")
    },
    {
      immediate: true,
    }
  )

  onBeforeUnmount(() => {
    // 取消订阅 暗夜切换
    mitt.off("isDark", setTheme)
    // 取消订阅 主题切换 事件
    mitt.off("themes", switchThemes)
  })
}
