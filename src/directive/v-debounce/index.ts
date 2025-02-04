import { Directive } from "vue"

interface DevTipOptions {
  time?: number // 防抖时间
  fn?: (...args: any[]) => void // 防抖回调函数
}

interface CustomDivElement extends HTMLDivElement {
  cloneClick: (e: MouseEvent) => void
  timer: null | ReturnType<typeof setTimeout>
}

export const vDebounce: Directive<CustomDivElement, DevTipOptions> = {
  mounted(el, options) {
    // 从 options.value 中提取 time 和 fn
    let time = options.value?.time || 300
    const fn = options.value?.fn

    // 如果没有传递回调函数，抛出错误
    if (!fn) {
      console.error(el, "当前元素绑定的 v-debounce 需要传入一个函数~")
      return
    }

    // 确保防抖时间为有效数字
    if (typeof time !== "number" || isNaN(time)) {
      time = 500
    }

    // 初始化计时器
    el.timer = null

    // 防抖点击事件回调
    el.cloneClick = (e: MouseEvent) => {
      if (el.timer) {
        clearTimeout(el.timer) // 清除之前的计时器
      }

      // 设置新的计时器
      el.timer = setTimeout(() => {
        el.timer = null // 重置计时器
        fn.call(el, e) // 执行回调函数并传递事件对象
      }, time)
    }

    // 添加事件监听（捕获阶段）
    el.addEventListener("click", el.cloneClick)
  },
  unmounted(el) {
    // 移除事件监听
    el.removeEventListener("click", el.cloneClick)

    // 清除计时器（防止内存泄漏）
    if (el.timer) {
      clearTimeout(el.timer)
      el.timer = null
    }
  },
}
