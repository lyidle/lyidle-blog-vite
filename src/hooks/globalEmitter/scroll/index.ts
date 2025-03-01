// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
export const useScrollListener = () => {
  const callback = () => {
    mitt.emit("scroll")
  }
  // 存储 事件
  let eventWindowScroll: null | (() => void) = null
  onMounted(() => {
    // 监听滚动事件 右侧挂饰的动画 和 按钮的 百分比滚动显示
    eventWindowScroll = useEventListener("scroll", callback)
  })
  onUnmounted(() => {
    // 移除监听滚动事件
    eventWindowScroll?.()
  })
}
