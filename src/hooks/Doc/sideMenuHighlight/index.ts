// 引入类型
import { createIntersectionObserver, ObserverCallback } from "@/utils/observer"
import type { TocNode } from "../vditorPreview/types"
import { mitt } from "@/utils/emitter"

// 导航条的高度
let headerHeight = 0

export const useSideMenuHighlight = (
  menuTree: Ref<TocNode[] | undefined>
): (() => void) | undefined => {
  // 不存在目录树则不需要代理
  if (!menuTree?.value?.length) return

  // 获取 所有 侧边栏的链接
  const sideMenuTree = document.querySelectorAll<HTMLAnchorElement>(
    ".doc-menu-tree li a[href^='#']"
  )

  // 存储标题
  const headings: HTMLHeadingElement[] = []
  // 存储目录 建立映射关系
  const menus = new Map<string, HTMLAnchorElement>()

  // 获取header 的 高度
  const header = document.querySelector(".global-header") as HTMLDivElement
  if (header) headerHeight = header.offsetHeight - 3

  // 遍历添加标题
  sideMenuTree.forEach((item) => {
    const hash = decodeURIComponent(new URL(item.href).hash)
    const dom = document.querySelector(hash) as HTMLHeadingElement
    // 添加 目录
    if (hash) menus.set(hash.substring(1), item)
    // 添加 标题
    if (dom) {
      headings.push(dom)
    }
  })

  // 存储监听器，用于组件销毁时结束监听
  const observerItems: ObserverCallback[] = []

  // 当前高亮的元素 ID
  let activeId: string | null = null

  // 用于 控制 点击时不执行监听
  let flag = true
  // 用于 控制 点击时不执行监听 回调函数
  const isObserver = (is: boolean = true) => {
    flag = is
  }

  // 监听器
  const headinsObserver = () => {
    // 默认第一个高亮
    sideMenuTree[0]?.classList.add("active")
    // 监听 是否取消observer 点击时不需要代理
    mitt.on("headinsObserver", isObserver)
    headings.forEach((item) => {
      if (!item) return // 如果 item 不存在，直接跳过
      const options: ObserverCallback = {
        enter: (entry) => {
          if (!flag) return
          const tar = menus.get(item.id)
          // 进入视口的元素高亮
          if (activeId !== item.id) {
            // 移除之前的高亮
            if (activeId) {
              const prev = menus.get(activeId)
              prev?.classList.remove("active")
            }

            // 处理点击后 移动 会有两个高亮的情况
            const active = document.querySelector<HTMLAnchorElement>(
              ".doc-menu-tree li a[href^='#'].active"
            )
            active?.classList.remove("active")

            // 设置当前高亮
            tar?.classList.add("active")
            activeId = item.id
          }
        },
      }
      // 存储监听器配置
      observerItems.push(options)
      createIntersectionObserver(item, options, {
        options: {
          // 顶部需要在 header 之下
          rootMargin: `${headerHeight}px 0px -80% 0px`, // 检测顶部交叉
        },
      })
    })
  }

  // 调用 交叉传感器监听
  headinsObserver()

  // 销毁的回调
  const destroy = () => {
    // 销毁监听
    observerItems.forEach((item) => {
      item.stop?.()
    })
    // 清除map
    menus.clear()
    // 清除监听
    mitt.off("headinsObserver", isObserver)
  }

  return destroy
}
