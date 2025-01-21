// 引入 mitt
import { mitt } from "@/utils/emitter"

export const useScrollListener = () => {
  const callback = () => {
    mitt.emit("scroll")
  }
  onMounted(() => {
    // 监听滚动事件 右侧挂饰的动画 和 按钮的 百分比滚动显示
    window.addEventListener("scroll", callback)
  })
  onUnmounted(() => {
    // 移除监听滚动事件 右侧挂饰的动画 和 按钮的 百分比滚动显示
    window.removeEventListener("scroll", callback)
  })
}
