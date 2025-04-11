import debounce from "@/utils/debounce"
import { mitt } from "@/utils/emitter"
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"

export const useResize = () => {
  // 回调
  const callback = debounce(() => {
    mitt.emit("window:resize")
  }, 500)

  // 存储 事件
  let eventWindowResize: null | (() => void) = null
  onMounted(() => {
    eventWindowResize = useEventListener("resize", callback)
  })

  onBeforeUnmount(() => {
    eventWindowResize?.()
  })
}
