// 引入类型
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

  if (direction === "left") {
    styleObject["left"] = 0
    styleObject["transform"] = `translateX(calc((${width} + 30px) * -1))`
  } else {
    styleObject["left"] = "unset"
    styleObject["right"] = 0
    styleObject["transform"] = `translateX(calc(${width} + 30px))`
  }

  return styleObject
}

// 三角的位置信息
export const triangleDirection = (
  width: string | number,
  direction?: directionType
) => {
  return direction === "left"
    ? {
        left: `calc(${width} + 17px)`,
        right: "unset",
        top: "34px",
        transform: "rotateZ(90deg)",
      }
    : {
        right: `unset`,
        left: "unset",
        top: "34px",
        transform: "rotateZ(270deg) translateY(-21px)",
      }
}

export const directionCallback = (
  dir?: directionType,
  local?: directionType
) => {
  return dir || local
}

// 取最大值
export type numType = string | number | undefined
export const menuMathMax = (num1: numType, num2: numType) => {
  let result = num1
  const handlerNum1 = parseFloat(`${num1}`) || 0
  const handlerNum2 = parseFloat(`${num2}`) || 0
  if (Math.max(handlerNum1, handlerNum2) === handlerNum2) result = num2
  // 判断处理后是否还没有单位
  const isUnit = /^(?=[\d.]+[a-zA-Z%]+$)(\d*\.?\d+)([a-zA-Z%]+)$/.test(
    `${result}`
  )

  // 没有单位的 加上px
  if (!isUnit) {
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
