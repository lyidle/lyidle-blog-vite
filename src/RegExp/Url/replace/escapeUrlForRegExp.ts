export const escapeUrlForRegExp = (url: string) => {
  // 这是一个更全面的转义列表，针对URL中可能出现的特殊字符
  return url.replace(/[.*+?^${}()|[\]\\/:;,=!@#"%<>&_~ ]/g, "\\$&")
}
