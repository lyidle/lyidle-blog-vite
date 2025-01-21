// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 mitt
import { mitt } from "@/utils/emitter"

export const useIsLogin = () => {
  const { userToken } = storeToRefs(useUserStore())
  // 监听 userToken 判断是否登录 有些组件 是根据数据生成的
  watch(
    () => userToken.value,
    (newV) => {
      mitt.emit("isLogin", newV)
    },
    {
      immediate: true,
    }
  )
}
