import { h } from "vue"

export const parsedIcon = (icon: string) => {
  // 判断是否是背景
  const isBg = icon.startsWith("background:")
  if (isBg) {
    // 得到背景
    const bg = icon.split("background:")[1]
    const result = {
      name: "bg",
      // 确保不是外链
      // 转义字符
      data: !/^https?:/.test(bg) ? JSON.stringify(bg) : "",
    }
    return result
  }

  // 仅允许 SVG 代码
  if (icon.startsWith("<svg")) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(icon, "image/svg+xml")

    // 检查解析后的 SVG 是否有效（防止 XSS）
    if (doc.documentElement.tagName.toLowerCase() === "svg") {
      // 用 h 函数创建 SVG VNode
      return {
        name: "svg",
        data: h("svg", { innerHTML: doc.documentElement.innerHTML }),
      }
    }
  }

  // 如果是其他类名
  return { name: "class", data: icon }
}
