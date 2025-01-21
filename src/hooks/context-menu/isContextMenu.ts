// 引入仓库
import { useSettingStore } from "@/store/setting"

// 订阅 context-menu 变化事件 组件本身重复使用了多次 导致提示时会提示多次信息
let onlyOne: string | null = null
// 切换的事件函数
const onlyOneContextMsg = (newV: boolean) => {
  if (newV) {
    const message = "鼠标美化中~"
    if (onlyOne !== message) {
      onlyOne = message
      ElMessage.success(message)
    }
    return
  }

  const message = "鼠标恢复默认中~"
  if (onlyOne !== message) {
    onlyOne = message
    ElMessage.success(message)
  }
}
export const useIsContextMenu = (reload: () => void, onUnMount: () => void) => {
  // 提取需要的变量
  const { isContextMenu } = storeToRefs(useSettingStore())
  // 使一开始的不用提示
  let flag = false
  // 监听 与 提示
  watch(
    () => isContextMenu.value,
    (newV) => {
      if (flag) onlyOneContextMsg(newV)
      if (newV) {
        reload()
        flag = true
        return
      }
      flag = true
      onUnMount()
    },
    {
      immediate: true,
    }
  )
}
