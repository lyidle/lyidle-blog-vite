export const escapeUrlForRegExp = (url: string) => {
  // 解码 URL 编码的字符
  const decodedUrl = decodeURIComponent(url)
  // 转义正则表达式中的特殊字符
  return decodedUrl.replace(/[.*+?^${}()|[\]\\/:;,=!@#"%<>&_~ -']/g, "\\$&")
}
