import { useSettingStore } from "@/store/setting"
import { mitt } from "@/utils/emitter"

export const useFullScreen = () => {
  const { isFullscreen } = storeToRefs(useSettingStore())

  const full = ($el: HTMLElement) => {
    // 调用全屏
    $el.requestFullscreen()
    isFullscreen.value = true
  }

  const exist = () => {
    isFullscreen.value = false
    // 退出全屏
    document.exitFullscreen()
  }

  const toggle = ($el: HTMLElement) => {
    const isFull = document.fullscreenElement
    if (isFull) {
      exist()
      return
    }
    if (!isFull) {
      full($el)
      return
    }
    exist()
  }

  // 劫持 F10 实现 元素的全屏
  const proxyF10Down = (e: KeyboardEvent) => {
    if (e.key === "F11") e.preventDefault()
    if (e.key === "F10") {
      e.preventDefault() // 禁用默认的 F10 行为
      toggle(document.documentElement)
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", proxyF10Down)
    mitt.on("fullScreenChange", toggle)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", proxyF10Down)
    mitt.off("fullScreenChange", toggle)
  })
}
