export default function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: setTimout | null = null

  // 节流函数
  const throttled = function (this: any, ...args: Parameters<T>) {
    if (!timer) {
      fn.apply(this, args)
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
  }

  // 取消节流方法
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return throttled as ((...args: Parameters<T>) => void) & {
    cancel: () => void
  }
}
