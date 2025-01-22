import { App, Directive } from "vue"
// 引入提示信息
import { vTip } from "./v-dev-tip"
// 引入 debounce
import { vDebounce } from "./v-debounce"
// 引入 节流
import { vThrottle } from "./v-throttle"
const directives: Record<string, Directive> = {
  vTip,
  vDebounce,
  vThrottle,
}
export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      // 转换为 kebab-case 格式
      const kebabCaseKey = key
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .slice(2)
      app.directive(kebabCaseKey, directives[key])
    })
  },
}
