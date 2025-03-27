type EventType<K extends HTMLElement | Window = HTMLElement> =
  keyof HTMLElementEventMap

export function useEventListener<K extends EventType<HTMLElement>>(
  element: HTMLElement | Ref<HTMLElement> | MediaQueryList,
  event: K,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): () => void

export function useEventListener<K extends EventType<Window>>(
  event: K,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): () => void

export function useEventListener<K extends EventType<HTMLElement | Window>>(
  ...args: any[]
): () => void {
  const element = typeof args[0] === "string" ? window : args.shift()

  let off = () => {}

  const stop = watch(
    () => unref(element),
    (el: HTMLElement | Window) => {
      off()
      if (!el) return
      el.addEventListener(
        ...(args as [K, EventListener, boolean | AddEventListenerOptions])
      )
      off = () =>
        el.removeEventListener(
          ...(args as [K, EventListener, boolean | AddEventListenerOptions])
        )
    },
    { immediate: true }
  )

  return () => {
    stop()
    off()
  }
}
