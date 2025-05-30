export const useIsFullscreen = (vditorEditor: Ref<HTMLDivElement>) => {
  // 初始化 进入和退出全屏 需要更改的元素 的变量
  // 导航栏
  let header: divType = null
  // 右侧 滚动挂饰
  let ornaments: divType = null
  const enterFn = () => {
    if (!header) header = document.querySelector(".global-header")
    if (!ornaments) ornaments = document.querySelector(".scroll-ornaments")
    if (!header) return
    header.style.display = "none"
    if (!ornaments) return
    ornaments.style.display = "none"
  }

  const existFn = () => {
    if (!header) header = document.querySelector(".global-header")
    if (!ornaments) ornaments = document.querySelector(".scroll-ornaments")
    if (!header) return
    header.style.display = "flex"
    if (!ornaments) return
    ornaments.style.display = "flex"
  }

  // 监听 attributes 判断 编辑器是否全屏
  const observer = ($el: Element, enter: () => void, exist: () => void) => {
    // 目标元素
    const targetNode = $el
    // 配置 MutationObserver
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // 检查是否包含某个类
          if (targetNode?.classList.contains("vditor--fullscreen")) {
            enter()
          } else {
            exist()
          }
        }
      }
    })

    // 配置观察选项
    const config = {
      attributes: true, // 监听属性变化
      attributeFilter: ["class"], // 只监听 class 属性
    }

    // 开始观察
    if (targetNode) {
      observer.observe(targetNode, config)
      return observer
    }
  }

  let ob: MutationObserver | undefined = undefined

  // 加载
  onMounted(() => {
    // 加载编辑器
    ob = observer(vditorEditor.value, enterFn, existFn)
  })

  // 卸载
  onBeforeUnmount(() => {
    ob && ob.disconnect()
  })
}
