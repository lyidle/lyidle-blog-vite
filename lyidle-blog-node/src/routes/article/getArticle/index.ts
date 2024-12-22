import express from "express"
// 引入moment
import moment from "@/utils/moment"
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
      "tip",
    ],
    limit: pageSize,
    offset,
  })
  // 整理参数
  const pagesData = rows.map((item: any) => ({
    id: item.id,
    poster: item.poster,
    title: item.title,
    desc: item.desc,
    createdAt: moment(item.createdAt, "YYYY-MM-DD"),
    updatedAt: moment(item.updatedAt, "YYYY-MM-DD"),
    category: item.category,
    tip: item.tip,
    to: `/doc/${item.category}/${item.id}`,
  }))
  return res.result(
    {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      article: pagesData,
    },
    "查询文章成功~"
  )
})
export default router
