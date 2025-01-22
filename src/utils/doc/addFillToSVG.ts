// 正则 svg 添加 属性 fill="currentColor"
const addFillToSVG = (htmlString: string): string => {
  return htmlString.replace(/<svg([^>]*)>/g, (match, attributes) => {
    // 如果已经存在 fill 属性，跳过添加
    if (/fill=/.test(attributes)) {
      return match
    }
    // 添加 fill="currentColor"
    return `<svg${attributes} fill="currentColor">`
  })
}
