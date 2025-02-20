// 引入 去重的函数
import { deduplication } from "@/utils/array/deduplication"
// 批量删除 redis 缓存
import { delKeys } from ".."

/**
 * 重置文章的缓存
 * @param findArticles 查询到达文章 是一个数组
 */
export const resetArticle = async (findArticles: any[]) => {
  const deleteArr = deduplication(
    JSON.parse(JSON.stringify(findArticles)).map((item: any) => [
      item.id,
      item.author,
    ])
  ).filter(Boolean)

  // 判断是否需要和删除缓存
  if (deleteArr && deleteArr.length) {
    // 删除 缓存
    await delKeys("ArticlefindByPk:", deleteArr, (keys) => keys)
    await delKeys("ArticlefindAuthorAndId:", deleteArr, (keys) => keys)
    // 最新文章的 缓存
    await delKeys("recentPages:")
    // 用户的 所有 tags
    await delKeys(`allTags:`)
    // 用户的 所有 categories
    await delKeys(`allCategories:`)
    // 获取文章 按照分页器 的格式返回
    await delKeys(`articlePagination:`)
    // 获取 文章的 轮播图 焦点图 字段为recommend true的
    await delKeys(`carousel:`)
  }
}
