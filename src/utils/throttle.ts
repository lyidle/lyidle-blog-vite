export default function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | null = null
  return function (...args: Parameters<T>) {
    if (!timer) {
      fn(...args)
      timer = setTimeout(() => {
        timer = null
      }, delay) as unknown as number | null
    }
  } as (...args: Parameters<T>) => void
}
