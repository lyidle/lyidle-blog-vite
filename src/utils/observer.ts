export interface ObserverCallback {
  enter?: (entry: IntersectionObserverEntry) => void // 接收单个 entry
  leave?: (entry: IntersectionObserverEntry) => void // 接收单个 entry
  stop?: () => void // 停止观察的方法
}

export const observer = (
  element: Element,
  callback: ObserverCallback
): void => {
  if (!(element instanceof Element)) return

  const intersectionObserver = new IntersectionObserver(($entries) => {
    const entry = $entries[0] // 获取第一个观察到的条目

    if (entry.intersectionRatio <= 0) {
      callback.leave?.(entry) // 将 entry 传递给 leave 方法
    } else {
      callback.enter?.(entry) // 将 entry 传递给 enter 方法
    }
  })

  intersectionObserver.observe(element)

  // 将停止观察的方法挂载到回调对象中
  callback.stop = () => {
    intersectionObserver.disconnect()
  }
}
