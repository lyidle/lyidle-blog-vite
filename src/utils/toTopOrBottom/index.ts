// 回到顶部
export const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}
// 到达底部
export const scrollBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  })
}
