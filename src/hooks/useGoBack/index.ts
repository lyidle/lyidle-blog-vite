import type { Router } from "vue-router"

// 返回上一个路径 没有时 回到指定路径
export function useGoBack(options?: { defaultPath?: string; router?: Router }) {
  // 默认 路径
  const defaultPath = options?.defaultPath || "/"

  const router = options?.router || useRouter()

  const goBack = () => {
    if (router.options.history.state.back !== null) {
      router.back() // 确保有可返回的历史记录时返回
    } else {
      router.replace(defaultPath) // 兜底，防止 go(-1) 失败
    }
  }

  return goBack
}
