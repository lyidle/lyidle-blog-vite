import { EffectEventTypes } from "./effectEventTypes"
// 定义事件类型
export type EventTypes = EffectEventTypes & {
  [key: string]: any // 允许其他未定义的事件
}
