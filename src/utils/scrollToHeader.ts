let headerHeight: null | number = null
/**
 *  跳转 到header之下
 * @param top 移动的距离
 * @returns
 */
export const scrollToHeader = (top: number) => {
  // 缓存不存在获取高度
  if (!headerHeight)
    headerHeight = (document.querySelector(".global-header") as HTMLDivElement)
      ?.offsetHeight
  const toScroll =
    top +
    (document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop) -
    headerHeight -
    3

  window.scrollTo({
    top: toScroll,
    behavior: "smooth",
  })
  return toScroll
}
