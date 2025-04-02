export interface ObserverCallback {
  enter?: (entry: IntersectionObserverEntry) => void // 当元素进入视口时触发
  leave?: (entry: IntersectionObserverEntry) => void // 当元素离开视口时触发
  stop?: () => void // 用于停止观察的方法
}

export interface ObserverConfig {
  options?: IntersectionObserverInit // IntersectionObserver 的配置选项
  reverse?: boolean // 是否反转观察顺序（默认 false）
}

/**
 * 观察目标元素的交叉状态（进入/离开视口）
 * @param element 要观察的 DOM 元素
 * @param callback 包含进入/离开回调的对象
 * @param config 可选的观察配置
 */
export const createIntersectionObserver = (
  element: Element,
  callback: ObserverCallback,
  config: ObserverConfig = {}
): (() => void) | void => {
  // 如果传入的不是有效的 DOM 元素，直接返回
  if (!(element instanceof Element)) return

  const { options, reverse = false } = config

  // 创建 IntersectionObserver 实例
  const intersectionObserver = new IntersectionObserver(($entries) => {
    let entry = $entries[0] // 默认取第一个条目

    // 根据 reverse 决定是否反转顺序（取最后一个条目）
    if (reverse) {
      entry = $entries[0]
    } else {
      entry = $entries.reverse()[0]
    }

    // 根据交叉比例触发对应回调
    if (entry.intersectionRatio <= 0) {
      callback.leave?.(entry) // 触发离开视口的回调
    } else {
      callback.enter?.(entry) // 触发进入视口的回调
    }
  }, options)

  // 开始观察目标元素
  intersectionObserver.observe(element)

  // 挂载停止观察的方法
  callback.stop = () => {
    intersectionObserver.disconnect()
  }

  // 手动停止的方法
  return () => intersectionObserver.disconnect()
}
