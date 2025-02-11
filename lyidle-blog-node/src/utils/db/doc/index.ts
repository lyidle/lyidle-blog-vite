// 整理 用户信息 如 总文章数、标签数、分类数
export const tinyUserDocsCounts = (article: any[]) => {
  // 页数
  const pages = article?.length || 0
  // 标签数
  let tags = 0
  let categories = 0
  // 对应的map
  let tagsMap: string[][] = []
  let categoriesMap: string[] = []
  article?.forEach((item) => {
    tagsMap.push(item.tags)
    categoriesMap.push(item.category)
  })
  // 展开去重 得到数量
  tags = [...new Set(tagsMap.flat(Infinity))].length
  categories = [...new Set(categoriesMap.flat(Infinity))].length
  return {
    pages,
    tags,
    categories,
  }
}
