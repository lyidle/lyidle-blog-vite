// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { effectReturnType } from "@/utils/effect"
// 引入 特效
import { useUnfoldClickEffect } from "./click/Unfold"
import { useStarFragmentsMoveEffect } from "./move/Star Fragments"

// 鼠标特效事件存储 对应的同时只能存在一个特效
let clickEventStore: effectReturnType | null = null
let moveEventStore: null | effectReturnType = null

// 移动特效事件的回调 保存当前特效到 对应的 store变量中
const moveCb = ($moveEventStore: effectReturnType) => {
  moveEventStore = $moveEventStore
}

// 点击特效事件的回调 保存当前特效到 对应的 store变量中
const clickCb = ($clickEventStore: effectReturnType) => {
  clickEventStore = $clickEventStore
}

export const useMouseEffect = () => {
  // 使用点击特效

  // 绽放的点击特效
  useUnfoldClickEffect()

  // 使用 移动特效
  useStarFragmentsMoveEffect()
  // 碎星的移动特效

  // 提取数据
  const { clickEffect, moveEffect, clicks, moves } = storeToRefs(
    useSettingStore()
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
            mitt.emit("clickEffect:normal", { newV: newVal, cb: clickCb })
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
            mitt.emit("moveEffect:normal", { newV: newVal, cb: moveCb })
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
}
