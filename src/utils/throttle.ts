export default function throttle<T extends (...args: any[]) => any>(
  fn: Function,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | null = null
  return function (this: any) {
    if (!timer) {
      const _this = this
      const args = arguments
      fn.apply(_this, args)
      timer = setTimeout(() => {
        timer = null
      }, delay) as unknown as number | null
    }
    return undefined
  }
}
