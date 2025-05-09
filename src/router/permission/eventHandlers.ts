import { mitt } from "@/utils/emitter"
import { useUserStore } from "@/store/user"
// 回到上一个路径
import { useGoBack } from "@/hooks/useGoBack"

// 错误信息去重处理
// token 错误信息
let onlyTokenmsg = ""

/**
 * 配置全局事件处理
 * @param router - Vue Router 实例
 */
export const routerEventHandlered = (router: any) => {
  // 处理 token 过期
  mitt.on("token expired", async () => {
    const msg = "token 过期,请重新登录~"
    if (onlyTokenmsg === msg) return
    onlyTokenmsg = msg
    ElMessage.warning(msg)
    // 清除数据
    const { userStoreReset } = useUserStore()
    await userStoreReset()
    // 一秒后重置
    const tim = setTimeout(() => {
      onlyTokenmsg = ""
      clearTimeout(tim)
    }, 1000)
    router.replace("/")
  })

  mitt.on("account inconsistent", (msg: string, to?: string) => {
    const goBack = useGoBack({ router, defaultPath: to })
    goBack()
    msg && ElMessage.warning(msg)
  })

  // 重新 判断权限是否通过 需要 在 route:reload 后执行
  mitt.on("authRoles", () => {
    // 得到 roles
    const { userRoles, userPermissions } = useUserStore()
    // 得到 roles
    const roles = router.currentRoute.value?.meta?.roles
    const permissions = router.currentRoute.value?.meta?.permissions
    let isAccess = true
    // 存在 roles 则判断是否含有 不含有则不通过
    if (
      roles?.length &&
      !roles.some((role: string) => userRoles.some((item) => item === role))
    )
      isAccess = false
    // 存在 permissions 则判断是否含有 不含有则不通过
    if (
      permissions?.length &&
      !permissions.some((role: string) =>
        userPermissions.some((item) => item === role)
      )
    )
      isAccess = false
    if (!isAccess) {
      router.replace("/")
      ElMessage.warning("权限丢失了")
    }
  })

  // 处理 Not Found 跳转
  mitt.on("NotFound", (msg: string, options?: { isTip?: boolean }) => {
    // 默认值 为 true
    const isTip = options?.isTip ?? true
    switch (msg) {
      case "not article":
        isTip && ElMessage.error("获取文章失败")
        router.replace("/404")
        break
      default:
        router.replace("/404")
        break
    }
  })

  // 到达首页
  mitt.on("replaceToHome", () => {
    router.replace("/")
  })
}
