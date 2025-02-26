/*
 * 把毫秒 转换成对应的时间单位
 */
export function formatMilliseconds(ms: number): string {
  if (ms < 0) {
    throw new Error("毫秒数不能是一个负数~")
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  return days > 0
    ? `${days}天`
    : hours > 0
    ? `${hours}小时`
    : minutes > 0
    ? `${minutes}分钟`
    : `${seconds}秒`
}
