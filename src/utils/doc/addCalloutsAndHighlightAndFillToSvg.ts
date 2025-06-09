export const addCalloutsAndHighlightAndFillToSvg = (
  htmlString: string
): string => {
  // 使用正则表达式分割字符串，区分代码块和非代码块部分
  const parts = htmlString.split(/(<pre><code[\s\S]*?<\/code><\/pre>)/g)

  // 只处理非代码块的部分
  for (let i = 0; i < parts.length; i++) {
    // 跳过代码块部分（奇数索引）
    if (i % 2 === 1) continue

    parts[i] = parts[i].replace(
      /==(.*?)==|<blockquote([^>]*)>\s*<p>\[!([^\]]+)\]|<blockquote>\s*<p>|<svg([^>]*)>/g,
      (
        match,
        highlightContent,
        blockquoteAttributes,
        tipType,
        svgAttributes
      ) => {
        if (highlightContent) {
          return `<span class='doc-highlight'>${highlightContent}</span>`
        } else if (tipType) {
          const wrappedTip = `<span class="callouts">[!${tipType}]</span><p>`
          if (blockquoteAttributes && /type=/.test(blockquoteAttributes)) {
            return match.replace(/<p>\[!([^\]]+)\]/, wrappedTip)
          }
          return `<blockquote${
            blockquoteAttributes || ""
          } type="${tipType}">${wrappedTip}`
        } else if (svgAttributes !== undefined) {
          if (/fill=/.test(svgAttributes)) {
            return match
          }
          return `<svg${svgAttributes} fill="currentColor">`
        } else {
          return '<blockquote type="default"><p><span class="callouts">[!default]</span>'
        }
      }
    )
  }

  // 重新组合所有部分
  return parts.join("")
}
