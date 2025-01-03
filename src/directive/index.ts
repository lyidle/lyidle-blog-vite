import { App, Directive } from "vue"
import DevTip from "./v-dev-tip"
const directives: Record<string, Directive> = {
  DevTip,
}
export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}
