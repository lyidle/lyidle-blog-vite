import express from "express"
// 引入moment
import moment from "@/utils/moment"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 获取最新文章
router.get("/", async (req, res) => {
  const limit = req.query.limit ?? 4
  const data = await Article.findAll({
    attributes: ["poster", "title", "createdAt", "updatedAt", "category", "id"],
    limit: Number(limit),
    order: [
      ["updatedAt", "desc"],
      ["id", "desc"],
    ],
  })
  // 整理参数
  const result = data.map((item: any) => ({
    id: item.id,
    poster: item.poster,
    title: item.title,
    createdAt: moment(item.createdAt, "YYYY-MM-DD"),
    updatedAt: moment(item.updatedAt, "YYYY-MM-DD"),
    to: `/doc/${item.category}/${item.id}`,
  }))
  return res.result(result, "获取最新文章成功~")
})
export default router
