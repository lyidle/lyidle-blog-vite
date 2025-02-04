import { Directive } from "vue"

interface DevTipOptions {
  time?: number // 节流时间
  fn?: (...args: any[]) => void // 节流回调函数
}

interface CustomDivElement extends HTMLDivElement {
  cloneClick: (e: MouseEvent) => void
  timer: null | ReturnType<typeof setTimeout>
}

export const vThrottle: Directive<CustomDivElement, DevTipOptions> = {
  mounted(el, options) {
    // 默认 1 秒
    let time = options.value?.time || 1000
    const fn = options.value?.fn

    if (!fn) {
      console.error(el, "当前元素绑定的 v-throttle 需要传入一个函数~")
      return
    }

    // 如果传入的时间不是数字或无效值，则设置为默认值
    if (typeof time !== "number" || isNaN(time)) {
      time = 500
    }

    // 初始化计时器
    el.timer = null

    // 点击事件回调
    el.cloneClick = (e: MouseEvent) => {
      // 如果计时器已经存在，则直接返回
      if (el.timer) return

      // 调用传入的函数并传递剩余参数
      fn.call(el, e)
      // 开启计时器
      el.timer = setTimeout(() => {
        el.timer = null // 重置计时器
      }, time)
    }

    // 添加事件监听
    el.addEventListener("click", el.cloneClick)
  },
  unmounted(el) {
    // 移除事件监听
    el.removeEventListener("click", el.cloneClick)

    // 清理计时器
    if (el.timer) {
      clearTimeout(el.timer)
      el.timer = null
    }
  },
}
