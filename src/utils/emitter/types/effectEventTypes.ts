import type { effectReturnType } from "@/utils/effect" // 导入特效事件类型
// 定义回调参数类型
export type CallbackParams = {
  cb: ($clickEventStore: effectReturnType) => void
  newV: boolean
}
// 定义点击或移动特效的事件类型
export type EffectEventTypes = {
  [K in `${"clickEffect" | "moveEffect"}:${string}`]: CallbackParams
}
