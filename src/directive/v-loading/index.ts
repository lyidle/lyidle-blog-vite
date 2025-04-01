import { Directive } from "vue"

// Types
interface LoadingOptions {
  show?: boolean
  text?: string
}

interface LoadingElement extends HTMLDivElement {
  _loadingEl?: HTMLDivElement
}

export const vMyLoading: Directive<
  LoadingElement,
  () => LoadingOptions | (() => Ref<boolean>) | boolean
> = {
  mounted(el, binding) {
    // 初始化元素
    el.className += " loading"
    watchEffect(() => {
      el.innerHTML = ""
      const bind = binding.value
      let opt: LoadingOptions = {
        show: false,
        text: "加载中...",
      }
      // 是函数
      if (typeof bind === "function") {
        const result = bind()
        // 解析后是 布尔
        if (typeof result === "boolean") {
          opt.show = result
          // 解析后是 对象
        } else if (typeof result === "object") {
          opt = unref(result)
          if (!opt.text) opt.text = "加载中..."
        } else {
          console.warn("loading指令出错，binding为函数解析后值不正确")
        }
      }
      // 是布尔值
      if (typeof bind === "boolean") {
        opt.show = bind
      }
      if (opt.show) {
        el.innerHTML = `
        <div class="line-1"></div>
        <div class="line-2"></div>
        <div class="text cur-text">${opt.text}</div>
      `
      }
    })
  },
  unmounted(el) {},
}
