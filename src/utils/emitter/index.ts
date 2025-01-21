// 引入 mitt
import { default as emitterAlias } from "mitt"
// 引入 mitt 的类型
import type { Emitter } from "mitt"
// 引入通用事件类型
import type { EventTypes } from "./types"

// 创建并直接导出类型化的 mitt 实例
export const mitt: Emitter<EventTypes> = emitterAlias<EventTypes>()
