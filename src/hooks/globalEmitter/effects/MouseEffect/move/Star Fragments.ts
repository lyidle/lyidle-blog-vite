// 引入鼠标点击和移动特效
import { moveEffectFn } from "@/utils/effect"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入类型
import type { CallbackParams } from "@/utils/emitter/types/effectEventTypes"

export const useStarFragmentsMoveEffect = () => {
  // 默认的移动特效
  const moveNormal = ({ cb, newV }: CallbackParams) => {
    //初始化特效函数
    const store = new moveEffectFn()
    cb(store)
    // 挂载 对应点击特效
    newV ? store.onMounted() : store.onUnMounted()
  }

  onMounted(() => {
    // 订阅 鼠标 移动事件
    mitt.on("moveEffect:normal", moveNormal)
  })

  onBeforeUnmount(() => {
    // 取消订阅 鼠标 移动事件
    mitt.off("moveEffect:normal", moveNormal)
  })
}
