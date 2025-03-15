import { Directive } from "vue"
// 引入 仓库
import { useUserStore } from "@/store/user"

// 类型
interface DevTipOptions {
  author: string
}
interface customDivELement extends HTMLDivElement {
  cloneClick: () => void
}
export const vAuthor: Directive<customDivELement, DevTipOptions> = {
  mounted(el, options) {
    const { userAccount, userToken } = storeToRefs(useUserStore())
    const { author } = options.value
    // 作者不一致
    if (!userToken.value || author !== userAccount.value) {
      el.remove()
    }
  },
  unmounted(el) {},
}
