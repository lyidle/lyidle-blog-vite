// 引入鼠标点击和移动特效
import { clickEffectFn } from "@/utils/effect"

export const useUnfoldClickEffect = () => {
  //初始化特效函数
  const store = new clickEffectFn()
  store.onMounted()
  // 挂载 对应点击特效
  return store
}
