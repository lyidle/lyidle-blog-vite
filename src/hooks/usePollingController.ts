import {
  PollingController,
  type PollingOptions,
} from "@/utils/PollingController"
import { useEventListener } from "./useEventListener"

export type usePollingControllerType = {
  focus?: () => void
  blur?: () => void
  unauto?: boolean
}
export const usePollingController = (
  options: PollingOptions,
  otherOptions?: usePollingControllerType
) => {
  const instance = new PollingController({ ...options })
  // 卸载
  onBeforeUnmount(instance.stop)
  // 自动处理
  if (!otherOptions?.unauto) {
    // 聚焦与失焦 恢复和暂停
    useEventListener("focus", () => {
      instance.resume()
      otherOptions?.focus?.()
    })
    useEventListener("blur", () => {
      instance.pause()
      otherOptions?.blur?.()
    })
  }
  return instance
}
