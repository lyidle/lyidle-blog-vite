// 引入鼠标点击和移动特效
import { clickEffectFn } from "@/utils/effect"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入类型
import type { CallbackParams } from "@/utils/emitter/types/effectEventTypes"

export const useUnfoldClickEffect = () => {
  // 默认的点击特效
  const clickNormal = ({ cb, newV }: CallbackParams) => {
    //初始化特效函数
    const store = new clickEffectFn()
    cb(store)
    // 挂载 对应点击特效
    newV ? store.onMounted() : store.onUnMounted()
  }

  onMounted(() => {
    // 订阅 鼠标点击效果事件
    mitt.on("clickEffect:normal", clickNormal)
  })

  onBeforeUnmount(() => {
    // 取消订阅 鼠标点击效果事件
    mitt.off("clickEffect:normal", clickNormal)
  })
}
