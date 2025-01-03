import { Directive } from "vue"
interface DevTipOptions {
  type: "warning" | "info" | "error"
  msg: string
}
interface customDivELement extends HTMLDivElement {
  cloneClick: () => void
}
const vDevTip: Directive<customDivELement, DevTipOptions> = {
  mounted(el, options) {
    el.cloneClick = () => {
      const { type, msg } = options.value
      ElMessage({ type, message: msg, grouping: true, offset: 50 })
    }
    el.addEventListener("click", el.cloneClick)
  },
  unmounted(el) {
    el.removeEventListener("click", el.cloneClick)
  },
}
export default vDevTip
