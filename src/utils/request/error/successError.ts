// 引入用户仓库
import { useUserStore } from "@/store/user"
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { DataObject as SearchErrorMsg } from "@/api/user/types/searchUser"
// 定义响应数据接口
interface ApiResponse {
  code: number // 状态码
  data: SearchErrorMsg
  message?: string[] | string // 错误消息数组或单个错误消息
  [property: string]: any
}

/**
 * 处理成功响应中的错误提示信息
 * @param response - 后端返回的响应数据
 */

export const handlerSuccessErrorMessage = (response: {
  data: ApiResponse
}): void | any => {
  // 没有找到资源 则提示路由守卫 跳转404页面
  if (response.data.code === 404) {
    mitt.emit("NotFound", response.data)
  }

  const { userToken } = storeToRefs(useUserStore())
  const token = userToken.value

  // 错误状态码汇总
  const errorCode = [400, 401, 403, 404]

  /*
    400 请求错误
    401 token 过期
    403 没有权限访问
  */

  // 如果没有 token 且状态码为 401，不进行错误提示
  if (!token && response.data.code === 401) return response.data
  // 有 token  且 为 401 则需要清除 信息等操作
  if (token && response.data.code === 401) {
    mitt.emit("token expired")
    return
  }

  // 如果是已知错误码且服务器返回了错误信息，显示错误信息
  if (errorCode.includes(response.data.code)) {
    // 处理 message 为 string 或 string[] 的情况
    const messages = Array.isArray(response.data?.message)
      ? response.data.message
      : [response.data?.message || "发生未知错误，请稍后再试~"]

    if (
      response.data?.data?.msg?.role === "admin" &&
      response.data?.message?.[0] === "查询用户信息失败~"
    ) {
      mitt.emit("handler request error", {
        msg: "网站管理员信息未初始化~",
        type: "warning",
      })
      return
    }

    messages.forEach((item: string) => {
      mitt.emit("handler request error", { msg: item })
    })
    return Promise.reject(messages)
  }

  // 处理其他未知错误
  mitt.emit("handler request error", { msg: "发生未知错误，请稍后再试~" })
  return Promise.reject("发生未知错误，请稍后再试~")
}
