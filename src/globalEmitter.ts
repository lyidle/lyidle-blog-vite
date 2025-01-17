// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入鼠标点击和移动特效
import { clickEffectFn, moveEffectFn } from "@/utils/effect"
// 引入 类型
import type { effectReturnType } from "@/utils/effect"
import type { EmitterEvents, callbackType } from "@/utils/emitter"

// 鼠标特效事件存储
let clickEventStore: effectReturnType | null = null
let moveEventStore: null | effectReturnType = null

// 移动特效事件的回调
const moveCb: EmitterEvents["moveEffect:normal"] = ($moveEventStore) => {
  moveEventStore = $moveEventStore
}

// 点击特效事件的回调
const clickCb: EmitterEvents["clickEffect:normal"] = ($clickEventStore) => {
  clickEventStore = $clickEventStore
}

// 暴露 全局的 emitter
export const useGlobalEmitter = () => {
  // 提取数据
  const {
    isDark,
    themes,
    clickEffect,
    moveEffect,
    clicks,
    moves,
    lights,
    darks,
  } = storeToRefs(useSettingStore())

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

  // 焦点图 固定
  const bannerFIxed = () => {
    // 根据 监听 的值来设置主题
    document.body.setAttribute("banner-fixed", "fixed")
  }
  // 焦点图 没有固定
  const bannerNormal = () => {
    // 根据 监听 的值来设置主题
    document.body.setAttribute("banner-fixed", "")
  }

  // 默认的点击特效
  const clickNormal = (cb: callbackType) => {
    //初始化特效函数
    const store = new clickEffectFn()
    cb(store)
    // 挂载 对应点击特效
    clickEffect.value ? store.onMounted() : store.onUnMounted()
  }

  // 默认的移动特效
  const moveNormal = (cb: callbackType) => {
    //初始化特效函数
    const store = new moveEffectFn()
    cb(store)
    // 挂载 对应点击特效
    moveEffect.value ? store.onMounted() : store.onUnMounted()
  }

  onMounted(() => {
    // 订阅暗夜切换
    mitt.on("isDark", setTheme)
    // 订阅 主题切换 事件
    mitt.on("themes", switchThemes)
    // 订阅 焦点图是否 固定事件
    mitt.on("bannerIsFixed:true", bannerFIxed)
    mitt.on("bannerIsFixed:false", bannerNormal)
    // 订阅 鼠标点击效果事件
    mitt.on("clickEffect:normal", clickNormal)
    // 订阅 鼠标 移动事件
    mitt.on("moveEffect:normal", moveNormal)

    // 监听 themes
    watch(
      () => themes.value,
      () => {
        mitt.emit("themes")
      },
      {
        immediate: true,
      }
    )

    // 监听 isDark
    watch(
      () => isDark.value,
      () => {
        // 统一触发
        mitt.emit("isDark")
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
            // 卸载其他 点击特效
            clickEventStore && clickEventStore.onUnMounted()
            if (newV === "normal") {
              mitt.emit("clickEffect:normal", clickCb)
            }
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
            // 卸载其他 点击特效
            moveEventStore && moveEventStore.onUnMounted()
            if (newV === "normal") {
              mitt.emit("moveEffect:normal", moveCb)
            }
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
  })

  onBeforeUnmount(() => {
    // 取消订阅 暗夜切换
    mitt.off("isDark", setTheme)
    // 取消订阅 主题切换 事件
    mitt.off("themes", switchThemes)
    // 取消订阅 焦点图是否 固定事件
    mitt.off("bannerIsFixed:true", bannerFIxed)
    mitt.off("bannerIsFixed:false", bannerNormal)
    // 取消订阅 鼠标点击效果事件
    mitt.off("clickEffect:normal", clickNormal)
    // 取消订阅 鼠标 移动事件
    mitt.off("moveEffect:normal", moveNormal)
  })
}
