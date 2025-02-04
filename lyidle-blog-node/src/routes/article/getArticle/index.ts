import express from "express"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 分页获取文章
router.get("/", async (req, res, next) => {
  try {
    const { query } = req
    /**
     * @pagesize 每页显示条目个数
     * @currentPage 当前页
     */
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    const { count, rows } = await Article.findAndCountAll({
      attributes: [
        "id",
        "author",
        "poster",
        "desc",
        "title",
        "createdAt",
        "updatedAt",
        "category",
        "tags",
        "userId",
      ],
      limit: pageSize,
      offset,
      where: { isBin: 0 },
    })
    if (JSON.stringify(rows) === "[]")
      return res.result(void 0, "获取文章失败~", false)
    return res.result(
      {
        pagination: {
          total: count,
          currentPage,
          pageSize,
        },
        article: rows,
      },
      "获取文章成功~"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取文章失败~", false)
    )
  }
})
export default router
