/**
 *
 * @param data any[]
 * @returns data 平铺后 去重的数组
 */
export const deduplication = (data: any[]) => {
  return [...new Set([data].flat(Infinity))]
}
