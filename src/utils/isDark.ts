export default (newvalue: boolean) => {
  if (newvalue) {
    // 修改html标签
    ;(document.querySelector("html") as HTMLElement).classList.add("dark")
  } else {
    ;(document.querySelector("html") as HTMLElement).classList.remove("dark")
  }
}
