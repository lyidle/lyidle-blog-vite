// @ts-ignore
import Big from "big.js"

/**
 * 将大数字字符串转换为带单位的字符串（万/亿/兆）
 * @param {string} numStr 数字字符串
 * @returns {string} 带单位的格式化字符串
 */
export const bigNumberTransform = (numStr: string | number): string => {
  try {
    const num = new Big(numStr || "0")

    // 定义单位阈值和对应单位
    const units = [
      { threshold: new Big("1e12"), unit: "兆" },
      { threshold: new Big("1e8"), unit: "亿" },
      { threshold: new Big("1e4"), unit: "万" },
    ]

    // 查找合适的单位
    for (const { threshold, unit } of units) {
      if (num.gte(threshold)) {
        // 除法计算并保留2位小数
        const divided = num.div(threshold)
        // 处理小数部分（去掉末尾的.00）
        let result = divided.toFixed(2)
        if (result.endsWith(".00")) {
          result = result.slice(0, -3)
        }
        return result + unit
      }
    }

    // 小于1万的直接返回原数字（去掉前导零）
    return num.toString().replace(/^0+/, "") || "0"
  } catch (error) {
    console.error("数值转换出错:", error)
    return "0"
  }
}
