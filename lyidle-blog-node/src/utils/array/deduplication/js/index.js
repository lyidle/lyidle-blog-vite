exports.deduplication = (...args) => {
  // 扁平化数组并去重
  const result = Array.from(new Set([args].flat(Infinity)))
  return result
}
