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

  mitt.on("account inconsistent", () => {
    router.replace("/")
    ElMessage.warning(`访问当前页面需要是本人的账户哦~`)
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

  // 处理 Not Found 跳转
  mitt.on("NotFound", (res) => {
    console.log(res)
    if (res.message?.includes("没有查找到文章哦~"))
      console.log("需要跳转没有文章的404页")

    router.push({ path: "/404", replace: true })
  })
}
