export const parsedIcon = (icon: string) => {
  const isBg = icon.startsWith("background:")
  if (isBg) {
    const bg = icon.split("background:")[1]
    return {
      name: "bg",
      data: !/^https?:/.test(bg) ? JSON.stringify(bg) : "",
    }
  }

  if (icon.startsWith("<svg")) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(icon, "image/svg+xml")

    if (doc.documentElement.tagName.toLowerCase() === "svg") {
      const svgElement = doc.documentElement

      // 指定 attributes 的类型
      const attributes: Record<string, string> = Array.from(
        svgElement.attributes
      ).reduce((acc: Record<string, string>, attr) => {
        acc[attr.name] = attr.value
        return acc
      }, {})

      return {
        name: "svg",
        data: h("svg", { ...attributes, innerHTML: svgElement.innerHTML }),
      }
    }
  }

  return { name: "class", data: icon }
}
