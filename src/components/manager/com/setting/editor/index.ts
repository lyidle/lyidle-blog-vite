// 判断是否是 vditor
export const isVditorEditor = (name: string) => {
  let isAccess = false
  switch (name) {
    case "关于":
      isAccess = true
      break
  }
  return isAccess
}
