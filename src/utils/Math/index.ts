// 取最大值
export type numType = string | number | undefined
export const MathMax = (num1: numType, num2: numType) => {
  let result = num1
  const handlerNum1 = parseInt(`${num1}`) || 0
  const handlerNum2 = parseInt(`${num2}`) || 0
  if (Math.max(handlerNum1, handlerNum2) === handlerNum2) result = num2
  return result
}

// 数值转为 万亿兆
export const numberTransform = (num: number) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "兆"
  } else if (num >= 1e8) {
    return (num / 1e8).toFixed(2) + "亿"
  } else if (num >= 1e4) {
    return (num / 1e4).toFixed(2) + "万"
  } else {
    return (num && num.toString()) || "0"
  }
}
