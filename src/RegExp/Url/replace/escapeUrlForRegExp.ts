/**
 * 转义正则表达式中的特殊字符
 * @param url 链接
 * @returns 处理后的 url
 */
export const escapeUrlForRegExp = (url?: string | null): string => {
  if (!url) return ""
  // 解码 URL 编码的字符
  const decodedUrl = decodeURIComponent(url)

  // 转义正则表达式中的特殊字符
  let result = decodedUrl.replace(
    /[.*+?^${}()|[\]\\/:;,=!@#"%<>&_~ -']/g,
    "\\$&"
  )
  return result
}
