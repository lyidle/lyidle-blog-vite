const html = document.querySelector("html") as HTMLElement
export default (newvalue: boolean) => {
  if (newvalue) {
    // 修改html标签
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
  }
}
