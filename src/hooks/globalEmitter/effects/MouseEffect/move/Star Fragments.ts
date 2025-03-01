// 引入鼠标点击和移动特效
import { moveEffectFn } from "@/utils/effect"

export const useStarFragmentsMoveEffect = () => {
  //初始化特效函数
  const store = new moveEffectFn()
  store.onMounted()
  return store
}
