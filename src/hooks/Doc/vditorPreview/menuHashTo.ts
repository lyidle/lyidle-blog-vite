import { useEventListener } from "@/hooks/useEventListener"
import { mitt } from "@/utils/emitter"
import { scrollToHeader } from "@/utils/scrollToHeader"

// 点击高亮
const clickHighlight = (tar: HTMLAnchorElement) => {
  let menus = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(`.doc-menu-tree a`)
  )
  if (!menus)
    menus = document.querySelectorAll<HTMLAnchorElement>(
      ".doc-menu-tree li a[href^='#']"
    ) as unknown as HTMLAnchorElement[]
  // 排他
  menus.forEach((item) => {
    item.classList.remove("active")
  })
  tar.classList.add("active")
}

let preAddEventListener = () => {}
export const useMenuHashTo = () => {
  // 点击 滚动
  const scrollTo = (id: string) => {
    const tar = document.querySelector(
      `.doc-content ${id}`
    ) as HTMLHeadingElement
    const target = document.querySelector(
      `.doc-menu-tree a[href='${id}']`
    ) as HTMLAnchorElement
    preAddEventListener()
    if (!tar || !target) return

    // 停止监听
    mitt.emit("headinsObserver", false)
    // 传入 对应需要高亮的信息
    clickHighlight(target)

    let scrollTimeout: setTimout
    preAddEventListener = useEventListener(window, "scroll", () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(function () {
        // 开始监听
        mitt.emit("headinsObserver", true)
      }, 100)
    })

    const top = tar.getBoundingClientRect().top
    // 调用滚动函数
    scrollToHeader(top)
  }
  return scrollTo
}
