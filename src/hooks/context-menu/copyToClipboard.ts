/**
 * 检查是否有选中的文本
 * @returns 返回选中的文本内容，如果没有选中则返回空字符串
 */
let text = ""
export const getSelectedText = async (): Promise<string> => {
  const selection = window.getSelection()
  if (selection && selection.toString().trim() !== "") {
    text = selection.toString()
    return text
  }
  text = ""
  return ""
}

/**
 * 将文本复制到剪贴板
 * @param text 要复制的文本
 * @returns 复制成功时返回 true，失败时抛出错误
 */
export const copyToClipboard = async (): Promise<void> => {
  if (!text) return
  await navigator.clipboard.writeText(text)
}

/**
 * 处理 contextmenu 事件：检查选中的文本并复制
 * @param event 鼠标右键事件
 */
export const handleContextMenu = async (event: MouseEvent): Promise<void> => {
  try {
    if (text) {
      await copyToClipboard()
      ElMessage.success(`文本已成功复制到剪贴板~`)
      return
    }
    ElMessage.warning("没有选中的文本哦~")
  } catch (error) {
    ElMessage.error(`复制失败了哦，错误是:${error}`)
  }
}
