export default function reqSetInterval<T extends (...args: any[]) => any>(
  fn: T,
  interval: number
): { cancel: () => void } {
  let lastTime = performance.now()
  let stopped = false

  // 包装的 interval 函数
  const tick = (currentTime: number) => {
    if (stopped) return
    if (currentTime - lastTime >= interval) {
      lastTime = currentTime
      fn()
    }
    requestAnimationFrame(tick)
  }

  // 开始执行
  const start = () => {
    lastTime = performance.now()
    stopped = false
    requestAnimationFrame(tick)
  }

  // 停止 interval
  const cancel = () => {
    stopped = true
  }

  // 调用执行
  start()

  return { cancel }
}
