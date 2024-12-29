import moment from "moment"

// 设置本地化语言为中文
moment.locale("zh-cn")

/**
 * 格式化日期
 * @param date - 需要格式化的日期
 * @param format - 格式化字符串
 * @returns 格式化后的日期字符串
 */
export const format = (date: Date, format: string): string => {
  return moment(date).format(format)
}

/**
 * 定义时间值类型：格式为 "<数字><单位>"，单位支持 h, m, s, y, M, d
 */
export type TimeValue = `${number}${"h" | "m" | "s" | "y" | "M" | "d"}`

/**
 * 自动识别时间值和单位并将其转换为毫秒
 * @param value - 包含数值和单位的字符串（如 "2h", "30m", "10s", "1y", "1M", "2d"）
 * @returns 转换为毫秒后的值
 */
export const convert = (value: TimeValue): number => {
  // 正则匹配数值和单位
  const match = value.match(/^(\d+)([hmsyMd])$/)
  if (!match) {
    throw new Error(`Invalid value format: ${value}`)
  }

  // 提取数值和单位
  const num = parseInt(match[1], 10)
  const unit = match[2]

  // 映射英文简写单位到 Moment.js 的标准单位
  const unitMap: Record<
    string,
    "hours" | "minutes" | "seconds" | "years" | "months" | "days"
  > = {
    h: "hours",
    m: "minutes",
    s: "seconds",
    y: "years",
    M: "months",
    d: "days",
  }

  const standardizedUnit = unitMap[unit]
  if (!standardizedUnit) {
    throw new Error(`Unsupported time unit: ${unit}`)
  }

  // 转换为毫秒
  return moment.duration(num, standardizedUnit).asMilliseconds()
}
