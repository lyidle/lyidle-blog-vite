/*
 * 把毫秒转换成对应的时间单位
 */
export function formatMilliseconds(
  ms: number,
  options: {
    day?: boolean
    hours?: boolean
    minutes?: boolean
    seconds?: boolean
  } = {
    day: true,
    hours: true,
    minutes: true,
    seconds: true,
  }
): string {
  if (ms < 0) {
    throw new Error("毫秒数不能是一个负数~")
  }

  const _seconds = Math.floor(ms / 1000)
  const _minutes = Math.floor(_seconds / 60)
  const _hours = Math.floor(_minutes / 60)
  const _days = Math.floor(_hours / 24)

  const { day = true, hours = true, minutes = true, seconds = true } = options

  if (day && _days > 0) {
    return `${_days}天`
  }

  if (hours && _hours > 0) {
    return `${_hours}小时`
  }
  if (minutes && _minutes > 0) {
    return `${_minutes}分钟`
  }
  if (seconds && _seconds > 0) {
    return `${_seconds}秒`
  }

  return "0秒"
}

/*
 * 将时间字符串转换为毫秒
 */
export function parseTimeToMilliseconds(timeStr: string): number {
  if (!timeStr) {
    throw new Error("时间字符串不能为空~")
  }

  // 正则表达式匹配数字和单位
  const match = timeStr.match(/^(\d+)(天|小时|分钟|秒)$/)
  if (!match) {
    throw new Error(
      "时间字符串格式不正确，应为 '1天'、'2小时'、'30分钟' 或 '45秒'"
    )
  }

  const value = parseInt(match[1], 10) // 提取数字部分
  const unit = match[2] // 提取单位部分

  // 根据单位计算毫秒
  switch (unit) {
    case "天":
      return value * 24 * 60 * 60 * 1000
    case "小时":
      return value * 60 * 60 * 1000
    case "分钟":
      return value * 60 * 1000
    case "秒":
      return value * 1000
    default:
      throw new Error("未知的时间单位~")
  }
}
