/**
 *
 * @param data any[]
 * @returns data 平铺后 去重的数组
 */
exports.deduplication = (data) => {
  return [...new Set([data].flat(Infinity))]
}
