/**
 * 转义正则表达式中的特殊字符
 * @param url 链接
 * @param options 配置项
 * @param options.escapeSlash 是否转义正斜杠（默认为 true）
 * @returns 处理后的 url
 */
export const escapeUrlForRegExp = (
  url?: string | null,
  options: { escapeSlash?: boolean } = { escapeSlash: true }
): string => {
  if (!url) return ""

  // 解码 URL 编码的字符
  const decodedUrl = decodeURIComponent(url)

  // 转义正则表达式中的特殊字符
  let result = decodedUrl.replace(
    /[.*+?^${}()|[\]\\/:;,=!@#"%<>&_~ -']/g,
    (match) => {
      // 如果配置项中 escapeSlash 为 false，且当前字符是正斜杠，则不转义
      if (!options.escapeSlash && match === "/") {
        return match
      }
      // 否则转义字符
      return `\\${match}`
    }
  )

  return result
}

/**
 * 替换 内容里的 urls
 * @param options.content 需要替换的文本
 * @param options.successImg 接口返回的 数据格式
 * @param options.isHttpsOrHttp origin的开头协议是否是 http 或者 https
 * @returns 处理后的 文本信息
 */
export const contextReplaceUrls = (options: {
  content: string
  successImg: { url: string; origin: string }[]
  isHttpsOrHttp?: boolean
}) => {
  const { content, successImg, isHttpsOrHttp } = options
  // 用于生成正则 替换用
  let origins = successImg
    .map((item: any) => {
      // 不是 http 和 https的 处理方法
      if (!isHttpsOrHttp) {
        // 统一路径分隔符为正斜杠
        const normalizedOrigin = item.origin.replace(/[\\\\/]/g, "/")
        // 对路径进行正则转义，但不转义正斜杠
        const escapedOrigin = escapeUrlForRegExp(normalizedOrigin, {
          escapeSlash: false,
        })
        // 将正斜杠替换为匹配正斜杠或反斜杠的正则表达式
        return escapedOrigin.replace(/\//g, "[\\\\/]")
      }
      // 协议是 http 和 https 的 处理方法
      let cur = item.origin
      const isHttp = cur.startsWith("http://") && "http://"
      const isHttps = cur.startsWith("https://") && "https://"
      // 判断 是 http 还是 https
      const httpOrHttps = isHttp || isHttps
      // 都不存在 退出
      if (!httpOrHttps) throw new Error("替换内容中的文本时出现错误")
      // 去掉 协议
      cur = cur.replace((isHttp as string) || (isHttps as string), "")

      // 统一路径分隔符为正斜杠
      const normalizedOrigin = cur.replace(/[\\\\/]/g, "/")
      // 对路径进行正则转义，但不转义正斜杠
      const escapedOrigin = escapeUrlForRegExp(normalizedOrigin, {
        escapeSlash: false,
      })
      // 将正斜杠替换为匹配正斜杠或反斜杠的正则表达式 拼接协议
      return httpOrHttps + escapedOrigin.replace(/\//g, "[\\\\/]")
    })
    .join("|")

  const reg = new RegExp(origins, "g")

  // 替换文本
  return content.replace(reg, (matched) => {
    const item = successImg.find(
      (img) => img.origin === matched.replace(/\\/g, "/")
    ) // 统一路径分隔符为正斜杠
    if (item) {
      // 确保 URL 中的路径分隔符为正斜杠
      let url = item.url.replace(/[\\\\]/g, "/")
      return url
    }
    return matched // 如果没有找到匹配的项，则返回原匹配字符串（或根据需要处理）
  })
}
