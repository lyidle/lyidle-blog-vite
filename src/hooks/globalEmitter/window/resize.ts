import debounce from "@/utils/debounce"
import { mitt } from "@/utils/emitter"

export const useResize = () => {
  // 回调
  const callback = debounce(() => {
    mitt.emit("window:resize")
  }, 500)

  onMounted(() => {
    window.addEventListener("resize", callback)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", callback)
  })
}
