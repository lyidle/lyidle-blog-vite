import { mitt } from "@/utils/emitter"
import errorMessages from "./errorMessages"

interface AxiosError {
  code?: string // Axios 错误代码
  response?: {
    status: number // HTTP 状态码
    data?: any // 响应数据
  }
  message?: string // 错误消息
}

/**
 * 根据 Axios 错误对象返回用户友好的错误信息并显示
 * @param error - Axios 错误对象
 */
export function handleErrorMessage(error: AxiosError): Promise<[string]> {
  let message: string = ""

  // 如果有 `error.code`，优先根据它添加对应消息
  if (error.code) {
    message = errorMessages[error.code] || "发生未知错误，请稍后再试~"
  }

  // 如果是 HTTP 响应错误，根据 `error.response.status` 添加消息
  if (error.response && error.response.status) {
    const status = error.response.status
    switch (status) {
      case 400:
        message = "请求参数错误，请检查输入！"
        break
      case 404:
        message = "请求的资源未找到，请检查 URL 是否正确！"
        break
      case 500:
        message = "服务器内部错误，请稍后再试！"
        break
      case 503:
        message = "服务不可用，请稍后再试！"
        break
      // 默认不添加状态码信息
    }
  }

  mitt.emit("handler request error", { msg: message })

  return Promise.reject(message)
}
