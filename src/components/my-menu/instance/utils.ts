// 引入类型
import { directionType } from "./types"
// 控制层级
let index = 0

// 根据方向算出具体的值 子集的位置信息
export const flowMenuContainerLeft = (
  width: number,
  direction?: directionType
) => {
  // 每次 子集菜单 自增
  ++index
  return direction === "left"
    ? `
      left: 0;
      transform: translateX(-${width + 25}px);
      z-index:${index};
    `
    : `
      left: unset;
      right: 0;
      transform: translateX(${width + 25}px);
      z-index:${index};
    `
}

// 三角的位置信息
export const triangleDirection = (direction?: directionType) => {
  return direction === "left"
    ? {
        left: "calc(50% + 10px)",
        top: "34px",
        transform: "rotateZ(90deg)",
      }
    : {
        right: "calc(50% + 10px)",
        top: "34px",
        transform: "rotateZ(270deg)",
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
  const handlerNum1 = parseInt(`${num1}`) || 0
  const handlerNum2 = parseInt(`${num2}`) || 0
  if (Math.max(handlerNum1, handlerNum2) === handlerNum2) result = num2
  return result as string
}
