exports.deduplication = (...args) => {
  // 扁平化数组并去重
  const result = [...new Set([args].flat(Infinity))]
  return result
}
