import express from "express"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 分页获取文章
router.get("/", async (req, res) => {
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
      "poster",
      "desc",
      "title",
      "createdAt",
      "updatedAt",
      "category",
      "tags",
    ],
    limit: pageSize,
    offset,
  })
  return res.result(
    {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      article: rows,
    },
    "查询文章成功~"
  )
})
export default router
