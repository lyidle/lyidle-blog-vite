// 随机颜色
export const randomColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

// 计算字体大小 (限制在 20px - 30px 之间)
export const calculateFontSize = (number: number) => {
  return Math.min(30, Math.max(20, 20 + number))
}
