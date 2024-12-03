//防抖实现
export default function debounce<T extends (...args: any[]) => any>(
  fn: Function,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: any = null
  return function (this: any) {
    const _this = this
    const args = arguments
    // 有就去除
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(_this, args)
    }, delay)
    return undefined
  }
}
