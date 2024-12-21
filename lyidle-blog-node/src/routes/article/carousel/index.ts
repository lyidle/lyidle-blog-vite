import express from "express"
// 引入moment
import moment from "@/utils/moment"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 获取轮播图
router.get("/", async (req, res) => {
  const limit = req.query.limit ?? 5
  const data = await Article.findAll({
    where: { carousel: 1 },
    attributes: ["poster", "updatedAt", "title", "desc", "category", "id"],
    limit: Number(limit),
    order: [
      ["updatedAt", "desc"],
      ["id", "desc"],
    ],
  })
  const result = data.map((item: any) => ({
    id: item.id,
    poster: item.poster,
    updatedAt: moment(item.updatedAt, "YYYY-MM-DD"),
    title: item.title,
    desc: item.desc,
    to: `/doc/${item.category}/${item.id}`,
  }))
  res.result(result, "获取首页焦点图成功~")
})
export default router
