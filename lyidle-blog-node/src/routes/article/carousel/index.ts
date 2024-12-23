import express from "express"
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
  res.result(data, "获取首页焦点图成功~")
})
export default router
