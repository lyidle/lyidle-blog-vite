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
  const deleteArr = deduplication(
    JSON.parse(JSON.stringify(findArticles)).map((item: any) => [
      item.id,
      item.author,
    ])
  ).filter(Boolean)

  // 判断是否需要和删除缓存
  if (deleteArr && deleteArr.length) {
    // 得到 ids
    const ids = deleteArr.filter(
      (item: string | number) => !Number.isNaN(+item) && +item
    )
    // 得到 accounts
    const accounts = deleteArr.filter(
      (item: string | number) => typeof item === "string" && item
    )
    // 删除 缓存
    // 删除总字数统计缓存
    await delKey("webTotalWords")
    // 最新文章的 缓存 使用的
    await delKeys("recentPages:")
    // 用户的 所有 tags 按照作者
    await delKeys(`allTags:`, accounts, (keys) => keys)
    // 用户的 所有 categories 按照作者
    await delKeys(`allCategories:`, accounts, (keys) => keys)
    // 获取文章 按照分页器 的格式返回
    await delKeys(`articlePagination:`)
    if (isResetCarousel)
      // 清除缓存
      await delKeys(`carousel:`)
  }
}
