// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
import { mitt } from "@/utils/emitter"
// 离开窗口和回来的提示标题
export const useSetTitleTip = () => {
  // 设置标题离开和回来的提示语
  let temp: string
  let tipFlag = JSON.parse(import.meta.env.VITE_TITLE_TIP_SHOW) ?? true
  const leaveTip = import.meta.env.VITE_LEAVE_TITLE_TIP || "不要离开~"
  const enterTip = import.meta.env.VITE_ENTER_TITLE_TIP || "欢迎回来~"
  const envDur = parseFloat(import.meta.env.VITE_TITLE_TIP_DURING)
  const tipDuring = isNaN(envDur) ? 1 : envDur
  let enterTimer: any
  let leaveTimer: any
  // 窗口获取焦点的回调
  const enterCallback = () => {
    mitt.emit("windowFocus", { focus: true })
    // 非空判断
    if (!temp) return
    // 回来时都要清除离开的定时器避免错乱
    clearTimeout(leaveTimer)
    // 提示
    document.title = enterTip
    enterTimer = setTimeout(() => {
      // 恢复
      document.title = temp
      // 清除定时器
      clearTimeout(enterTimer)
    }, tipDuring * 1000)
  }
  // 窗口失去焦点的回调
  const leaveCallback = () => {
    mitt.emit("windowBlur", { blur: true })
    // 非空判断
    if (!document.title) return
    // 离开时记录
    if (document.title !== leaveTip && document.title !== enterTip)
      temp = document.title
    // 提示
    document.title = leaveTip
    leaveTimer = setTimeout(() => {
      // 恢复
      document.title = temp
      // 清除定时器
      clearTimeout(leaveTimer)
    }, tipDuring * 1000)
  }
  // 存储 事件
  let eventWindowFocus: null | (() => void) = null
  let eventWindowBlur: null | (() => void) = null
  onMounted(() => {
    if (tipFlag) {
      eventWindowFocus = useEventListener("focus", enterCallback)
      eventWindowBlur = useEventListener("blur", leaveCallback)
    }
  })
  onBeforeUnmount(() => {
    eventWindowFocus?.()
    eventWindowBlur?.()
  })
}
