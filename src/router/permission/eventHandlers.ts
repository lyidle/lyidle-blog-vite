import { mitt } from "@/utils/emitter"
import { useUserStore } from "@/store/user"

// 错误信息去重处理
let onlyTokenmsg = ""

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
    const msg = "token 过期,请重新登录~"
    if (onlyTokenmsg === msg) return
    ElMessage.warning(msg)
    onlyTokenmsg = msg
    const tim = setTimeout(() => {
      onlyTokenmsg = ""
      clearTimeout(tim)
    }, 1000)
    router.push({ path: "/", replace: true })
  })

  mitt.on("account inconsistent", (msg: string) => {
    router.push({ path: "/", replace: true })
    msg && ElMessage.warning(msg)
  })

  // 重新 判断权限是否通过 需要 在 route:reload 后执行
  mitt.on("authRoles", () => {
    // 得到 roles
    const { whitelist } = useUserStore()
    if (whitelist) {
      // 判断是否通过白名单
      let isAccess = false
      // 得到 匹配的路由
      const matched = router.currentRoute.value?.matched
      if (matched) {
        for (const value of matched) {
          // 判断 路径是否在 白名单中
          if (whitelist.includes(value.path)) {
            isAccess = true
            return
          }
        }
      }
      if (!isAccess) {
        router.push({ path: "/", replace: true })
        ElMessage.warning("权限丢失了")
      }
    }
  })

  // 处理 Not Found 跳转
  mitt.on("NotFound", (msg: string) => {
    switch (msg) {
      case "not article":
        console.error("需要调整到没有文章的404页面~")
        ElMessage.error("获取文章失败")
        // router.push({ path: "/404", replace: true })
        break
      default:
        router.push({ path: "/404", replace: true })
        break
    }
  })
}
