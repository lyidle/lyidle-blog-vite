// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 类型
import type { effectReturnType } from "@/utils/effect"
// 引入 特效
import { useUnfoldClickEffect } from "./click/Unfold"
import { useStarFragmentsMoveEffect } from "./move/Star Fragments"

// 鼠标特效事件存储 对应的同时只能存在一个特效
let clickEventStore: effectReturnType | null = null
let moveEventStore: null | effectReturnType = null

export const useMouseEffect = () => {
  // 提取数据
  const { clickEffect, moveEffect, clicks, moves } = storeToRefs(
    useSettingStore()
  )

  let clickClose = () => {}
  // 监听 clickEffect
  watch(
    () => clickEffect.value,
    (newVal) => {
      clickEventStore && clickEventStore.onUnMounted()
      if (!newVal) return
      // 清除上一次的
      clickClose()
      clickClose = watch(
        () => clicks.value,
        (newV) => {
          // 卸载其他 点击特效
          clickEventStore && clickEventStore.onUnMounted()
          if (newV === "normal") {
            // 绽放的点击特效
            clickEventStore = useUnfoldClickEffect()
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

  let moveClose = () => {}
  // 监听 moveEffect
  watch(
    () => moveEffect.value,
    (newVal) => {
      moveEventStore && moveEventStore.onUnMounted()
      if (!newVal) return
      // 清除上一次的
      moveClose()
      moveClose = watch(
        () => moves.value,
        (newV) => {
          // 卸载其他 点击特效
          moveEventStore && moveEventStore.onUnMounted()
          if (newV === "normal") {
            // 碎星的移动特效
            moveEventStore = useStarFragmentsMoveEffect()
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
