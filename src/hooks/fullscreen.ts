// fullscreen hooks
// 引入仓库
import { useSettingStore } from "@/store/setting"
export default () => {
  const { isFullScreen } = storeToRefs(useSettingStore())
  // 全屏按钮相关事件 F11后再调用api会失效
  // F11劫持
  const fullScreenCb = () => {
    let full = document.fullscreenElement
    isFullScreen.value = !full
    if (!full) {
      // 文档根节点的方法requestFullscreen，实现全屏模式
      document.documentElement.requestFullscreen()
    } else {
      // 退出全屏模式
      document.exitFullscreen()
    }
  }
  // 全屏事件回调
  const F11Proxy = (e: KeyboardEvent) => {
    if (e.key === "F11") {
      e.preventDefault()
      fullScreenCb()
    }
  }
  onMounted(() => {
    window.addEventListener("keydown", F11Proxy)
  })
  return { fullScreenCb }
}
