import { Directive } from "vue"
interface DevTipOptions {
  type: "warning" | "info" | "error"
  msg: string
}
interface customDivELement extends HTMLDivElement {
  cloneClick: () => void
}
export const vTip: Directive<customDivELement, DevTipOptions> = {
  mounted(el, options) {
    const { type, msg } = options.value
    el.cloneClick = () => {
      ElMessage({ type, message: msg, grouping: true, offset: 50 })
    }
    el.addEventListener("click", el.cloneClick)
  },
  unmounted(el) {
    el.removeEventListener("click", el.cloneClick)
  },
}
