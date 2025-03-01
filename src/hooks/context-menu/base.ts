// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 鼠标 是否美化 的逻辑
import { useIsContextMenu } from "./isContextMenu"
// 引入 复制到剪贴板的方法
import { getSelectedText } from "@/hooks/context-menu/copyToClipboard"
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
export const useContextMenu = (
  menu: Ref<HTMLDivElement>,
  container: Ref<HTMLDivElement>
) => {
  // 提取需要的变量
  const { isCopyText } = storeToRefs(useSettingStore())
  // 菜单的高宽
  const menuHeigh = ref()
  const menuWidth = ref()
  // 打开菜单
  const open = async ($e: Event) => {
    const e = $e as MouseEvent
    // 阻止默认事件 和  冒泡
    e.preventDefault()
    e.stopPropagation()
    // 重置高度
    menu.value.style.height = "0"
    // 判断有无选中文本
    const text = await getSelectedText()

    if (text) isCopyText.value = true
    else isCopyText.value = false

    // 获取点击位置
    let x = e.clientX
    let y = e.clientY
    // 获取可视区域大小 出去自身
    const windowX =
      document.documentElement.clientWidth - parseFloat(menuWidth.value)
    const windowY =
      document.documentElement.clientHeight - parseFloat(menuHeigh.value)
    // 处理边界
    x >= windowX ? (x = windowX) : x
    y >= windowY ? (y = windowY) : y
    // 展开 加过度 和 位置
    menu.value.style.height = menuHeigh.value
    menu.value.style.transition = "height .5s"
    menu.value.style.top = `${y}px`
    menu.value.style.left = `${x}px`
  }
  // 关闭菜单
  const close = () => {
    // 高度重置
    if (menu.value) menu.value.style.height = "0"
  }

  // 初始化高度
  const geometricinfo = () => {
    nextTick(() => {
      if (menu.value) menu.value.style.height = "auto"
      // 记录高度
      menuHeigh.value = menu.value.offsetHeight + "px"
      menuWidth.value = menu.value.offsetWidth + "px"
      menu.value.style.height = "0"
    })
  }

  // 重载
  const reload = () => {
    onUnMount()
    onMount()
  }

  // 存储 事件
  let eventContextmenu: null | (() => void) = null
  let eventClick: null | (() => void) = null
  let eventWindowContextmenu: null | (() => void) = null
  // 加载
  const onMount = () => {
    nextTick(() => {
      geometricinfo()
      eventContextmenu = useEventListener(container, "contextmenu", open)
      //使用捕获 先关闭 再打开菜单 防止多个菜单出现
      eventClick = useEventListener("click", close, true)
      eventWindowContextmenu = useEventListener("contextmenu", close, true)
    })
  }

  // 卸载
  const onUnMount = () => {
    eventContextmenu?.()
    eventClick?.()
    eventWindowContextmenu?.()
  }

  // 监听 鼠标是否开启
  useIsContextMenu(reload, onUnMount)

  // 卸载组件
  onBeforeUnmount(() => {
    onUnMount()
  })
}
