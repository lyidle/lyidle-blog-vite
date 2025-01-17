import { default as emitterAlias } from "mitt" // 导入并使用别名
import type { Emitter } from "mitt" // 导入 mitt 的类型
import type { effectReturnType } from "@/utils/effect" // 导入自定义类型
export type callbackType = (cb: effectReturnType | null) => void
// 定义通用事件类型
export type EmitterEvents = {
  [K in `${"clickEffect" | "moveEffect"}:${string}`]: callbackType
} & {
  [key: string]: any // 允许其他未定义的事件
}

// 创建并直接导出类型化的 mitt 实例
export const mitt: Emitter<EmitterEvents> = emitterAlias<EmitterEvents>()
