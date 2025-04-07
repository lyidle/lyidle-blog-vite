/**
 * 创建一个防抖的 ref
 * @param value 初始值
 * @param delay 延迟时间（毫秒），默认 500ms
 */
export function useDebouncedRef<T>(value: T, delay = 500) {
  let timeout: setTimout | null = null

  return customRef((track, trigger) => {
    return {
      get() {
        track() // 追踪依赖
        return value
      },
      set(newValue: T) {
        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          value = newValue
          trigger() // 触发更新
          timeout = null
        }, delay)
      },
    }
  })
}
