//节流实现
export default function throttle(fn: Function, delay: number) {
  let timer: any = null
  return function (this: any) {
    const _this = this
    const args = arguments
    // 没有就进入
    if (!timer) {
      fn.apply(_this, args)
      timer = setTimeout(() => {
        timer = null //超过时间间隔把状态位timer设为有效
      }, delay)
      return undefined
    }
  }
}
