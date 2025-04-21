import express from "express"
const router = express.Router()
// 引入模型
const { ArticleBookmark } = require("@/db/models")
// 分页获取收藏
router.get("/", async (req, res, next) => {
  const msg = "获取收藏"
  const { query } = req
  const { userId } = req.query
  if (!userId || !Number.isInteger(+userId))
    return res.result(void 0, msg + "失败,userId不合法", false)
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await ArticleBookmark.findAndCountAll({
      where: {
        userId,
        isBookmarked: 1,
      },
      order: [["createdAt", "desc"], [["id", "desc"]]],
      limit: pageSize,
      offset,
    })

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      list: rows,
    }

    return res.result(result, msg + "成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router
