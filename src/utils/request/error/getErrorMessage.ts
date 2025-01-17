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
export function handleErrorMessage(error: AxiosError): void {
  const messages: string[] = []

  // 如果有 `error.code`，优先根据它添加对应消息
  if (error.code) {
    messages.push(errorMessages[error.code] || "发生未知错误，请稍后再试~")
  }

  // 如果是 HTTP 响应错误，根据 `error.response.status` 添加消息
  if (error.response && error.response.status) {
    const status = error.response.status
    switch (status) {
      case 400:
        messages.push("请求参数错误，请检查输入！")
        break
      case 404:
        messages.push("请求的资源未找到，请检查 URL 是否正确！")
        break
      case 500:
        messages.push("服务器内部错误，请稍后再试！")
        break
      case 503:
        messages.push("服务不可用，请稍后再试！")
        break
      // 默认不添加状态码信息
    }
  }

  // 如果服务器返回了错误信息，则将其添加到数组
  const cloudMessages = error.response?.data?.message
  if (Array.isArray(cloudMessages) && cloudMessages.length > 0) {
    messages.push(...cloudMessages)
  }

  // 如果最终没有任何消息，添加默认未知错误
  if (messages.length === 0) {
    messages.push("发生未知错误，请稍后再试~")
  }

  // 使用 Set 去重后返回数组
  const uniqueMessages = Array.from(new Set(messages))

  // 循环显示错误信息
  uniqueMessages.forEach((msg) => {
    ElMessage.error(msg)
  })
}
