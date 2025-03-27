// 引入正则
import { urlReg } from "@/RegExp/Url/isUrl"

export const parsedIcon = (icon: string) => {
  const isBg = icon?.startsWith("background:")
  // 默认 图标
  const _default = { name: "class", data: "i-tdesign:filter-3-filled" }
  // 是database 图标
  if (isBg) {
    const bg = icon.split("background:")[1]
    return {
      name: "bg",
      data: !urlReg.test(bg) ? JSON.stringify(bg) : "",
    }
  }

  // 是 svg
  if (icon?.startsWith("<svg")) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(
      icon
        .replace(/fill="[^"]*"/g, 'fill="currentColor"')
        .replace(/fill:[^;"]*(;|")/g, "fill:currentColor$1"),
      "image/svg+xml"
    )
    if (doc.documentElement.tagName.toLowerCase() === "svg") {
      const svgElement = doc.documentElement
      // 指定 attributes 的类型
      const attributes: Record<string, string> = Array.from(
        svgElement.attributes
      ).reduce((pre: Record<string, string>, attr) => {
        pre[attr.name] = attr.value
        return pre
      }, {})

      return {
        name: "svg",
        data: h("svg", { ...attributes, innerHTML: svgElement.innerHTML }),
      }
    }
  }

  // 没有图标
  if (!icon) {
    return _default
  }

  // class 图标 需要打包时 有导入 类名
  return { name: "class", data: icon }
}
