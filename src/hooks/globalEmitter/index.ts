// 引入 鼠标 特效相关 事件
import { useMouseEffect } from "./effects/MouseEffect"
// 引入 主题切换相关 事件
import { useSwitchThemes } from "./themes"
// 引入 鼠标 滚动事件
import { useScrollListener } from "./scroll"
// 暴露 全局的 emitter
export const useGlobalEmitter = () => {
  // 挂载鼠标特效
  useMouseEffect()
  // 挂载主题切换相关事件
  useSwitchThemes()
  //  监听滚动事件 右侧挂饰的动画 和 按钮的 百分比滚动显示
  useScrollListener()
}
