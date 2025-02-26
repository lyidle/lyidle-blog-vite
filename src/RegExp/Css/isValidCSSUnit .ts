/**
 * 验证 是否是一个css 的单位
 */
export const isValidCSSUnitReg = /^(\d+(\.\d+)?)(px|rem|%|em|vh|vw|vmin|vmax)?$/
/**
 * 验证 是否是一个css 的单位
 */
export const isValidCSSUnit = (str: string) => {
  return isValidCSSUnitReg.test(str)
}
/**
 * 判断css是否带有单位
 * @param str string
 * @returns boolean
 */
export const hasCSSUnit = (str: string) => {
  const regex = /^(\d+(\.\d+)?)(px|rem|%|em|vh|vw|vmin|vmax)$/
  return regex.test(str)
}
