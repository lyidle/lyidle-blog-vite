// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
/**
 * 上下的按钮 百分比动画的动画逻辑。
 *
 * @param timeout - 动画的超时时间（单位：毫秒），默认为 500 毫秒。
 *
 */
export const useUpOrDown = (timeout: number = 500) => {
  // 提取需要的信息
  const { scrollPercentage } = storeToRefs(useSettingStore())

  // 定义滚动方向的类型
  type ScrollDirection = "up" | "down" | ""
  const scrollTop = ref<number>(0) //滚动距离
  const direction = ref<ScrollDirection>("") // 滚动方向

  // 更新滚动方向和位置的方法
  watch(
    () => scrollTop.value,
    (newV, oldV) => {
      if (newV > oldV) {
        direction.value = "down"
      } else if (newV < oldV) {
        direction.value = "up"
      }
    }
  )

  const upValue = ref()
  let upTimer: ReturnType<typeof setTimeout> | null = null
  const downValue = ref()
  let downTimer: ReturnType<typeof setTimeout> | null = null

  watchEffect(() => {
    // 向上滚动
    if (direction.value === "up") {
      if (scrollPercentage.value === 0) upValue.value = 1
      else upValue.value = scrollPercentage.value
      upTimer && clearTimeout(upTimer)
      upTimer = setTimeout(() => {
        upValue.value = 0
      }, timeout)
      return
    }
    if (direction.value === "down") {
      downValue.value = scrollPercentage.value
      downTimer && clearTimeout(downTimer)
      downTimer = setTimeout(() => {
        downValue.value = 0
      }, timeout)
      return
    }
  })

  // 滚动距离计算
  const mathScroll = () => {
    // 当前滚动距离
    scrollTop.value = window.scrollY || document.documentElement.scrollTop
  }

  // 订阅滚动事件
  mitt.on("scroll", mathScroll)

  onBeforeUnmount(() => {
    // 取消订阅滚动事件
    mitt.off("scroll", mathScroll)
  })

  return { upValue, downValue }
}
