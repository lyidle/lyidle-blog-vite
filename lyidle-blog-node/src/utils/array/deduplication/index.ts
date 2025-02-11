exports.deduplication = (data: any) => {
  return [...new Set([data].flat(Infinity))]
}
