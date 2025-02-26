// 引入类型
import { hasCSSUnit, isValidCSSUnitReg } from "@/RegExp/Css/isValidCSSUnit "
import { directionType, MenuItem } from "./types"
// 控制层级
let index = 0
export type styleType = { [key: string]: string | number }

// 根据方向算出具体的值 子集的位置信息
export const flowMenuContainerLeft = (
  width: string | number,
  direction?: directionType
): styleType => {
  // 每次子集菜单自增
  ++index

  const styleObject: styleType = {
    zIndex: index,
  }

  if (direction === "right") {
    styleObject["left"] = "unset"
    styleObject["right"] = 0
    styleObject["transform"] = `translateX(calc(${width} + 30px))`
    styleObject["--isLeft"] = 1
    return styleObject
  }

  styleObject["left"] = 0
  styleObject["transform"] = `translateX(calc((${width} + 30px) * -1))`
  styleObject["--isLeft"] = -1

  return styleObject
}

// 三角的位置信息
export const triangleDirection = (
  width: string | number,
  direction?: directionType
): { [key: string]: string | number } => {
  const styleObject: { [key: string]: string | number } = {
    top: "34px", // 公共样式
  }
  if (direction === "right") {
    styleObject["right"] = `unset`
    styleObject["left"] = "unset"
    styleObject["transform"] = "rotateZ(270deg) translateY(-20px)"
    return styleObject
  }

  styleObject["left"] = `calc(${width} + 16px)`
  styleObject["right"] = "unset"
  styleObject["transform"] = "rotateZ(90deg)"

  return styleObject
}

export const directionCallback = (
  dir?: directionType,
  local?: directionType
) => {
  return dir || local
}

export type numType = string | number | undefined
// 取最大值 和 得到 宽度判断有无单位
export const menuMathMax = (num1: numType, num2: numType) => {
  let result = num1
  const handlerNum1 = parseFloat(`${num1}`) || 0
  const handlerNum2 = parseFloat(`${num2}`) || 0
  if (Math.max(handlerNum1, handlerNum2) === handlerNum2) result = num2
  // 判断 是否带有单位
  const isValidate = hasCSSUnit(`${result}`)
  // 没有单位 加上px
  if (!isValidate) {
    return `${parseFloat(`${result}`) || 0}px`
  }

  return result as string
}

// 处理出同级别 最大的单位
export const handlerMaxWidth = (item: MenuItem) => {
  const num = item.children
    ?.map((child) => child.layout?.topnavWidth)
    .filter((width): width is string => Boolean(width)) // 过滤掉 undefined/null

  if (!num || num.length === 0) {
    return "0px"
  }

  // 提取数值部分进行比较
  return num.reduce((max, current) => {
    const maxValue = parseFloat(max) // 提取数值部分
    const currentValue = parseFloat(current)
    return currentValue > maxValue ? current : max
  })
}
