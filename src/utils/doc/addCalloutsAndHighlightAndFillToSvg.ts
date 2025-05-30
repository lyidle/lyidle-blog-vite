export const addCalloutsAndHighlightAndFillToSvg = (
  htmlString: string
): string => {
  return htmlString.replace(
    /==(.*?)==|<blockquote([^>]*)>\s*<p>\[!([^\]]+)\]|<blockquote>\s*<p>|<svg([^>]*)>/g,
    (match, highlightContent, blockquoteAttributes, tipType, svgAttributes) => {
      if (highlightContent) {
        // 匹配高亮文本 ==内容==
        return `<span class='doc-highlight'>${highlightContent}</span>`
      } else if (tipType) {
        // 匹配 blockquote 的 [!type] 情况
        const wrappedTip = `<span class="callouts">[!${tipType}]</span><p>`
        if (blockquoteAttributes && /type=/.test(blockquoteAttributes)) {
          // 如果已有 type 属性，仅替换 [!type]
          return match.replace(/<p>\[!([^\]]+)\]/, wrappedTip)
        }
        // 添加 type 属性并替换 [!type]
        return `<blockquote${
          blockquoteAttributes || ""
        } type="${tipType}">${wrappedTip}`
      } else if (svgAttributes !== undefined) {
        // 匹配 <svg>，添加 fill="currentColor" 属性
        if (/fill=/.test(svgAttributes)) {
          // 如果已存在 fill 属性，保持不变
          return match
        }
        // 添加 fill="currentColor"
        return `<svg${svgAttributes} fill="currentColor">`
      } else {
        // 匹配没有 [!type] 的默认 blockquote
        return '<blockquote type="default"><p><span class="callouts">[!default]</span>'
      }
    }
  )
}
