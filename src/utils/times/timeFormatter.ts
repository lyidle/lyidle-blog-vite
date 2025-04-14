import Big from "big.js"

/*
 * 把毫秒转换成对应的时间单位（使用Big.js处理大数）
 */
export function formatMilliseconds(
  ms: number | string,
  options: {
    year?: boolean
    month?: boolean
    day?: boolean
    hours?: boolean
    minutes?: boolean
    seconds?: boolean
  } = {
    year: true,
    month: true,
    day: true,
    hours: true,
    minutes: true,
    seconds: true,
  }
): string {
  // 使用Big.js处理输入
  const milliseconds = new Big(ms)

  if (milliseconds.lt(0)) {
    throw new Error("毫秒数不能是一个负数~")
  }

  // 定义时间单位常量（使用Big.js）
  const SECOND = new Big(1000)
  const MINUTE = new Big(60).times(SECOND)
  const HOUR = new Big(60).times(MINUTE)
  const DAY = new Big(24).times(HOUR)
  const MONTH = new Big(30).times(DAY) // 1个月按30天计算
  const YEAR = new Big(12).times(MONTH)

  // 计算各个时间单位
  const _seconds = milliseconds.div(SECOND).round(0, Big.roundDown)
  const _minutes = milliseconds.div(MINUTE).round(0, Big.roundDown)
  const _hours = milliseconds.div(HOUR).round(0, Big.roundDown)
  const _days = milliseconds.div(DAY).round(0, Big.roundDown)
  const _months = milliseconds.div(MONTH).round(0, Big.roundDown)
  const _years = milliseconds.div(YEAR).round(0, Big.roundDown)

  const {
    year = true,
    month = true,
    day = true,
    hours = true,
    minutes = true,
    seconds = true,
  } = options

  if (year && _years.gt(0)) {
    return `${_years.toString()}年`
  }

  if (month && _months.gt(0)) {
    return `${_months.toString()}个月`
  }

  if (day && _days.gt(0)) {
    return `${_days.toString()}天`
  }

  if (hours && _hours.gt(0)) {
    return `${_hours.toString()}小时`
  }
  if (minutes && _minutes.gt(0)) {
    return `${_minutes.toString()}分钟`
  }
  if (seconds && _seconds.gt(0)) {
    return `${_seconds.toString()}秒`
  }

  return "0秒"
}

/*
 * 将时间字符串转换为毫秒（使用Big.js处理大数）
 */
export function parseTimeToMilliseconds(timeStr: string): string {
  if (!timeStr) {
    throw new Error("时间字符串不能为空~")
  }

  // 正则表达式匹配数字和单位
  const match = timeStr.match(/^(\d+)(年|个月|天|小时|分钟|秒)$/)
  if (!match) {
    throw new Error(
      "时间字符串格式不正确，应为 '1年'、'2个月'、'3天'、'4小时'、'30分钟' 或 '45秒'"
    )
  }

  const value = new Big(match[1]) // 使用Big.js处理数字部分
  const unit = match[2] // 提取单位部分

  // 定义时间单位常量（使用Big.js）
  const SECOND = new Big(1000)
  const MINUTE = new Big(60).times(SECOND)
  const HOUR = new Big(60).times(MINUTE)
  const DAY = new Big(24).times(HOUR)
  const MONTH = new Big(30).times(DAY)
  const YEAR = new Big(12).times(MONTH)

  // 根据单位计算毫秒
  switch (unit) {
    case "年":
      return value.times(YEAR).toString()
    case "个月":
      return value.times(MONTH).toString()
    case "天":
      return value.times(DAY).toString()
    case "小时":
      return value.times(HOUR).toString()
    case "分钟":
      return value.times(MINUTE).toString()
    case "秒":
      return value.times(SECOND).toString()
    default:
      throw new Error("未知的时间单位~")
  }
}
