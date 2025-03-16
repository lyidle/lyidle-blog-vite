// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 鼠标 是否美化 的逻辑
import { useIsContextMenu } from "./isContextMenu"
// 引入 复制到剪贴板的方法
import { getSelectedText } from "@/hooks/context-menu/copyToClipboard"
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
export const useContextMenu = () => {
  // 提取需要的变量
  const { isCopyText } = storeToRefs(useSettingStore())
  // 菜单的高宽
  const menuHeigh = ref()
  const menuWidth = ref()
  // 打开菜单
  const open = async ($e: Event) => {
    isClosed = false
    if (!menu) return
    // 初始化高度
    geometricinfo()
    const e = $e as MouseEvent
    // 阻止默认事件 和  冒泡
    e.preventDefault()
    e.stopPropagation()
    // 重置高度
    menu.style.height = "0"
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
    menu.style.height = menuHeigh.value
    menu.style.transition = "height .5s"
    menu.style.top = `${y}px`
    menu.style.left = `${x}px`
  }
  let isClosed = true
  // 关闭菜单
  const close = () => {
    isContent.value = false
    isUserEditor.value = false
    isClosed = true
    // 高度重置
    if (!menu) return
    menu.style.height = "0"
  }

  // 初始化高度
  const geometricinfo = () => {
    initEl()
    if (!menu) return
    menu.style.height = "auto"
    // 记录高度
    menuHeigh.value = menu.offsetHeight + "px"
    menuWidth.value = menu.offsetWidth + "px"
    menu.style.height = "0"
  }

  // 重载
  const reload = () => {
    onUnMount()
    onMount()
  }

  const isContent = ref(false)
  const isUserEditor = ref(false)
  const isUserEditorTransitioned = ref(false)
  // 菜单容器
  let menu: HTMLDivElement | undefined
  // 初始化元素
  const initEl = () => {
    if (!menu) {
      menu = document.querySelector(".menu-context") as HTMLDivElement
      // 监听 transitionend 事件 判断 是否关闭  关闭的话则初始化 ref变量
      eventTransitionend = useEventListener(menu, "transitionend", () => {
        if (!isClosed) return
        isUserEditorTransitioned.value = false
      })
    }
  }

  // 存储 事件
  let eventContextmenu: null | (() => void) = null
  let eventClick: null | (() => void) = null
  let eventWindowContextmenu: null | (() => void) = null
  let eventTransitionend: null | (() => void) = null
  // 加载
  const onMount = () => {
    nextTick(() => {
      // 初始化高度
      geometricinfo()
      eventContextmenu = useEventListener("contextmenu", open)
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
    eventTransitionend?.()
  }

  // 监听 鼠标是否开启
  useIsContextMenu(reload, onUnMount)

  // 卸载组件
  onBeforeUnmount(() => {
    onUnMount()
  })
  return {
    isContent,
    isUserEditor,
    isUserEditorTransitioned,
  }
}
