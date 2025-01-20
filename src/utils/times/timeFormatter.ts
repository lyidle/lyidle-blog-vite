// timeFormatter.ts
export function formatMilliseconds(ms: number): string {
  if (ms < 0) {
    throw new Error("毫秒数不能是一个复数~")
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}小时`
  } else if (minutes > 0) {
    return `${minutes}分钟`
  } else {
    return `${seconds}秒`
  }
}
