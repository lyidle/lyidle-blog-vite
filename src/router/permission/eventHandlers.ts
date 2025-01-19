import { mitt } from "@/utils/emitter"
import { useUserStore } from "@/store/user"

/**
 * 配置全局事件处理
 * @param router - Vue Router 实例
 */
export const routerEventHandlered = (router: any) => {
  // 处理 token 过期
  mitt.on("token expired", () => {
    // 清除数据
    const { userStoreReset } = useUserStore()
    userStoreReset()
    ElMessage.warning("token 过期,请重新登录~")
  })

  // 错误信息去重处理
  let onlyOne = ""
  mitt.on("handler request error", (message: string) => {
    if (onlyOne === message) return
    onlyOne = message
    ElMessage.error(message)
  })

  // 订阅路由变化
  mitt.on("router changed", () => {
    // 重置 错误信息
    onlyOne = ""
  })

  // 处理 Not Found 跳转
  mitt.on("NotFound", () => {
    router.push("/404")
  })
}
