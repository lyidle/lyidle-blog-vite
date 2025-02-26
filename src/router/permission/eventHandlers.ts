import { mitt } from "@/utils/emitter"
import { useUserStore } from "@/store/user"

// 错误信息去重处理
let onlyOne = ""

/**
 * 配置全局事件处理
 * @param router - Vue Router 实例
 */
export const routerEventHandlered = (router: any) => {
  // 处理 token 过期
  mitt.on("token expired", async () => {
    // 清除数据
    const { userStoreReset } = useUserStore()
    await userStoreReset()
    ElMessage.warning("token 过期,请重新登录~")
    router.push({ path: "/", replace: true })
  })

  mitt.on("account inconsistent", (msg: string) => {
    router.push({ path: "/", replace: true })
    msg && ElMessage.warning(msg)
  })

  mitt.on("handler request error", ({ msg, type }) => {
    if (onlyOne === msg) return
    onlyOne = msg
    ElMessage({ message: msg, type: type || "error" })
  })

  // 订阅路由变化
  mitt.on("router changed", () => {
    // 重置 错误信息
    onlyOne = ""
  })

  // 重新 判断权限是否通过 需要 在 route:reload 后执行
  mitt.on("authRoles", () => {
    // 得到 roles
    const { whitelist } = useUserStore()
    // 得到 当前 路径的 roles
    const cur = router.currentRoute.value.path
    // 判断 路径是否在 白名单中
    if (whitelist && !whitelist.includes(cur)) {
      router.push({ path: "/", replace: true })
      ElMessage.warning("权限丢失了哦~")
    }
  })

  // 处理 Not Found 跳转
  mitt.on("NotFound", (res) => {
    if (res.message?.includes("没有查找到文章哦~"))
      console.log("需要跳转没有文章的404页")

    router.push({ path: "/404", replace: true })
  })
}
