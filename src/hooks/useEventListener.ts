// 事件目标类型，可以是HTML元素、窗口、文档、媒体查询列表或它们的Ref引用
type EventTargetType =
  | HTMLElement
  | Window
  | Document
  | MediaQueryList
  | Ref<HTMLElement | Window | Document | MediaQueryList | null | undefined>

// 事件监听选项，可以是布尔值或AddEventListenerOptions对象
type EventListenerOptions = boolean | AddEventListenerOptions

// 重载1：当第一个参数是字符串时（默认window目标）
export function useEventListener<K extends keyof WindowEventMap>(
  event: K, // 窗口事件名
  listener: (this: Window, ev: WindowEventMap[K]) => any, // 事件回调
  options?: EventListenerOptions // 可选参数
): () => void

// 重载2：HTML元素目标
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Ref<HTMLElement | null | undefined>, // 目标元素或其Ref
  event: K, // HTML元素事件名
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, // 事件回调
  options?: EventListenerOptions // 可选参数
): () => void

// 重载3：窗口目标
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | Ref<Window | null | undefined>, // 窗口对象或其Ref
  event: K, // 窗口事件名
  listener: (this: Window, ev: WindowEventMap[K]) => any, // 事件回调
  options?: EventListenerOptions // 可选参数
): () => void

// 重载4：文档目标
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document | Ref<Document | null | undefined>, // 文档对象或其Ref
  event: K, // 文档事件名
  listener: (this: Document, ev: DocumentEventMap[K]) => any, // 事件回调
  options?: EventListenerOptions // 可选参数
): () => void

// 重载5：后备方案，用于自定义事件或其他目标
export function useEventListener(
  target: EventTargetType | string, // 目标或事件名
  event: string, // 事件名
  listener: EventListenerOrEventListenerObject, // 事件回调
  options?: EventListenerOptions // 可选参数
): () => void

// 函数实现
export function useEventListener(...args: any[]): () => void {
  // 如果第一个参数是字符串，则默认使用window作为目标
  const element = typeof args[0] === "string" ? window : args.shift()

  // 用于存储移除事件监听的函数
  let off = () => {}

  // 使用watch观察目标元素变化
  const stop = watch(
    () => unref(element), // 解包Ref值
    (el: HTMLElement | Window | Document | MediaQueryList | null) => {
      // 先移除旧的事件监听
      off()
      // 如果元素不存在则返回
      if (!el) return

      // 添加新的事件监听
      el.addEventListener(
        ...(args as [
          string,
          EventListenerOrEventListenerObject,
          EventListenerOptions?
        ])
      )

      // 更新移除函数
      off = () =>
        el.removeEventListener(
          ...(args as [string, EventListenerOrEventListenerObject])
        )
    },
    { immediate: true } // 立即执行
  )

  // 返回清理函数
  return () => {
    stop() // 停止观察
    off() // 移除事件监听
  }
}
