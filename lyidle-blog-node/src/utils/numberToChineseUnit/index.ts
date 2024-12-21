// 数值转为 万亿兆
export default (num: number) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "兆"
  } else if (num >= 1e8) {
    return (num / 1e8).toFixed(2) + "亿"
  } else if (num >= 1e4) {
    return (num / 1e4).toFixed(2) + "万"
  } else {
    return num.toString()
  }
}
