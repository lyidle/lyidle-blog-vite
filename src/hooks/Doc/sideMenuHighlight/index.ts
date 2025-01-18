// 引入类型
import type { TocNode } from "../vditorPreview/types"
// 引入防抖函数
import debounce from "@/utils/debounce"
// 引入仓库
import { useSettingStore } from "@/store/setting"

// 导航条的高度
let headerHeight = 0

export const useSideMenuHighlight = (
  menuTree: Ref<TocNode[]>
): (() => void) | undefined => {
  // 不存在目录树则不需要代理
  if (!menuTree.value.length) return

  // 获取 所有 侧边栏的链接
  const sideMenuTree = document.querySelectorAll<HTMLAnchorElement>(
    ".doc-menu-tree li a[href^='#']"
  )

  // 存储标题
  const headings: HTMLHeadingElement[] = []
  const header = document.querySelector(".global-header") as HTMLDivElement

  // 获取header 的 高度
  if (header) headerHeight = header.offsetHeight - 3

  // 遍历添加标题
  sideMenuTree.forEach((item) => {
    const hash = decodeURIComponent(new URL(item.href).hash)
    const dom = document.querySelector(hash) as HTMLHeadingElement
    if (dom) headings.push(dom)
  })

  // 高亮函数
  const highlight = (id: string) => {
    sideMenuTree.forEach((item) => {
      item.classList.remove("active")
    })
    const tar = document.querySelector(`.doc-menu-tree li a[href='#${id}']`)
    tar && tar.classList.add("active")
  }

  // 滚动函数
  let scrollCallback: (() => void) | null = null

  const normalScroll = () => {
    // 最后一个元素
    const lastHeading = headings[headings.length - 1]
    // 如果最后一个元素的顶部为负数 则 高亮
    if (lastHeading.getBoundingClientRect().top < 0) {
      highlight(lastHeading.id)
      return
    }

    // 获取几何信息集合
    const rects = headings.map((item) => item.getBoundingClientRect())

    // 遍历 首个出现的高亮
    for (let i = 0; i < rects.length; i++) {
      const heading = headings[i]
      const rect = rects[i]
      const top = rect.top
      // 首个出现的高亮
      if (top >= headerHeight) {
        highlight(heading.id)
        break
      }
    }
  }

  const debouncedScroll = debounce(() => {
    normalScroll()
  }, 300)

  // 提取需要的函数
  const { isDebouncedMenuHighlight } = storeToRefs(useSettingStore())

  let isDestroy = false

  // 销毁的回调
  const destroy = () => {
    if (isDestroy) {
      scrollCallback && window.removeEventListener("scroll", scrollCallback)
      isDestroy = false
    }
  }

  watch(
    () => isDebouncedMenuHighlight.value,
    (newV) => {
      // 销毁之前的 监听
      destroy()
      if (newV) {
        scrollCallback = debouncedScroll
        isDestroy = true
        window.addEventListener("scroll", scrollCallback)
      } else {
        scrollCallback = normalScroll
        isDestroy = true
        window.addEventListener("scroll", scrollCallback)
      }
    },
    {
      immediate: true,
    }
  )

  return destroy
}
