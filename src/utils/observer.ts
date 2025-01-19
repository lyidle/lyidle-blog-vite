export interface ObserverCallback {
  enter?: (entry: IntersectionObserverEntry) => void // 进入视口时的回调
  leave?: (entry: IntersectionObserverEntry) => void // 离开视口时的回调
  stop?: () => void // 停止观察的方法
}

export interface ObserverConfig {
  options?: IntersectionObserverInit // IntersectionObserver 的配置项
  reverse?: boolean // 是否反转观察顺序
}

export const observer = (
  element: Element,
  callback: ObserverCallback,
  config: ObserverConfig = {}
): void => {
  if (!(element instanceof Element)) return

  const { options, reverse = false } = config

  const intersectionObserver = new IntersectionObserver(($entries) => {
    let entry = $entries[0]

    // 根据是否反转决定获取第一个或最后一个条目
    if (reverse) {
      entry = $entries[0]
    } else {
      entry = $entries.reverse()[0]
    }

    if (entry.intersectionRatio <= 0) {
      callback.leave?.(entry) // 调用 leave 回调
    } else {
      callback.enter?.(entry) // 调用 enter 回调
    }
  }, options)

  intersectionObserver.observe(element)

  // 挂载停止观察的方法
  callback.stop = () => {
    intersectionObserver.disconnect()
  }
}
