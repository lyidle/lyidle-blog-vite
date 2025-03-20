// 引入 去重的函数
import { deduplication } from "@/utils/array/deduplication"
// 批量删除 redis 缓存
import { delKey, delKeys } from ".."

/**
 * 重置文章的缓存
 * @param findArticles 查询到达文章 是一个数组
 */
export const resetArticle = async (
  findArticles: any[],
  isResetCarousel?: boolean
) => {
  const categoriesSet = new Set()
  const deleteArr = deduplication(
    JSON.parse(JSON.stringify(findArticles)).map((item: any) => {
      categoriesSet.add(item.category)
      return [item.id, item.author]
    })
  ).filter(Boolean)
  // 得到 去重后的 category
  const categories = Array.from(categoriesSet) as string[]
  categoriesSet.clear()

  // 判断是否需要和删除缓存
  if (deleteArr && deleteArr.length) {
    // 得到 ids
    // const ids = deleteArr.filter(
    //   (item: string | number) => !Number.isNaN(+item) && +item
    // )
    // 得到 accounts
    const accounts = deleteArr.filter(
      (item: string | number) => typeof item === "string" && item
    )
    // 删除 缓存

    const results = await Promise.allSettled([
      // 删除 总字数统计缓存
      delKey("webTotalWords"),
      // 最新文章的 缓存 使用的
      delKeys("recentPages:"),
      // 用户的 所有 tags 按照作者
      delKeys(`allTags:`, accounts),
      // 用户的 所有 categories 按照作者
      delKeys(`allCategories:`, accounts),
      // 删除所有 articlePagination: 开头的 缓存
      delKeys(`articlePagination:`),
      (async () => {
        // 需要 清除 categories 则 清除
        if (categories.length)
          await delKeys(`category:search:allTag:`, categories)
      })(),
      (async () => {
        // 需要 清除 carousel 则 清除 所有
        if (isResetCarousel)
          // 清除缓存
          await delKeys(`carousel:`)
      })(),
    ])

    // 检查是否有任务失败
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("删除文章的缓存失败:", result.reason)
      }
    })
  }
}
