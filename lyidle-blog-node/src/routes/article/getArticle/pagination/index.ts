import express from "express"
// redis
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
const ms = require("ms")
const default_expire = ms(process.env.default_expire)
// 分页获取文章
router.get("/", async (req, res, next) => {
  const { query } = req
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  // 判断有无缓存
  const cacheValue = await getKey(
    `articlePagination:${currentPage},${pageSize}`
  )
  if (cacheValue) return res.result(cacheValue, "获取文章成功~")

  try {
    const { count, rows } = await Article.findAndCountAll({
      attributes: { exclude: ["UserId", "content"] },
      order: [["carousel", "desc"], [["id", "desc"]]],
      limit: pageSize,
      offset,
    })

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      article: rows,
    }

    if (count)
      // 设置 缓存
      await setKey(
        `articlePagination:${currentPage},${pageSize}`,
        result,
        default_expire
      )

    return res.result(result, "获取文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取文章失败~", false)
    )
  }
})
export default router
