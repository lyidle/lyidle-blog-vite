import { useEventListener } from "@/hooks/useEventListener"

/**
 * 页面可见度监听函数  chrome 监听不到
 * @param callback 函数
 * @returns void
 */
export const setupVisibilityListener = (
  callback: (status: boolean) => void
) => {
  const visibilityProperty = document.visibilityState

  if (!visibilityProperty) {
    console.warn("Page Visibility API not supported")
    return
  }

  useEventListener(document, "visibilitychange", () =>
    callback(!visibilityProperty)
  )
}
