// 给 markdown 添加 高亮显示 ==高亮文本==
export const addHighlight = (htmlString: string): string => {
  return htmlString.replace(
    /==(.*?)==/g,
    "<span class='doc-highlight'>$1</span>"
  )
}
