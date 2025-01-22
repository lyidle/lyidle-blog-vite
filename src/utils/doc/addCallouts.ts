// 给 blockquote 添加 type 以实现 callouts [!tip]
export const addTypeToBlockquote = (htmlString: string): string => {
  return htmlString
    .replace(
      /<blockquote([^>]*)>\s*<p>\[!([^\]]+)\]/g,
      (match, attributes, tipType) => {
        // 包裹 [!type] 的部分为 <span> 元素
        const wrappedTip = `<span class="callouts">[!${tipType}]</span><p>`
        // 检查是否已存在 type 属性
        if (/type=/.test(attributes)) {
          return match.replace(/<p>\[!([^\]]+)\]/, wrappedTip) // 替换 [!type]
        }
        // 添加 type 属性并替换 [!type]
        return `<blockquote${attributes} type="${tipType}">${wrappedTip}`
      }
    )
    .replace(
      /<blockquote>\s*<p>/g,
      '<blockquote type="default"><p><span class="callouts">[!default]</span>'
    )
}
