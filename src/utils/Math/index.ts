// 取最大值
export type numType = string | number | undefined
export const MathMax = (num1: numType, num2: numType) => {
  let result = num1
  const handlerNum1 = parseInt(`${num1}`) || 0
  const handlerNum2 = parseInt(`${num2}`) || 0
  if (Math.max(handlerNum1, handlerNum2) === handlerNum2) result = num2
  return result
}
