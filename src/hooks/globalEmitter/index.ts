// 引入 鼠标 特效相关 事件
import { useMouseEffect } from "./effects/MouseEffect"
// 引入 主题切换相关 事件
import { useSwitchThemes } from "./themes"
// 引入 鼠标 滚动事件
import { useScrollListener } from "./scroll"
// 引入 F11劫持
import { useFullScreen } from "./window/fullScreen"
// 监听窗口大小变化事件
import { useResize } from "./window/resize"
// 暴露 全局的 emitter
export const useGlobalEmitter = () => {
  // 挂载鼠标特效
  useMouseEffect()
  // 挂载主题切换相关事件
  useSwitchThemes()
  //  监听滚动事件 右侧挂饰的动画 和 按钮的 百分比滚动显示
  useScrollListener()
  // 使用 F11劫持 实现全屏
  useFullScreen()
  // 监听窗口大小变化事件 防抖的
  useResize()
}
