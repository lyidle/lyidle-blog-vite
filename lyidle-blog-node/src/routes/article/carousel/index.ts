import express from "express"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 获取轮播图
router.get("/", async (req, res, next) => {
  try {
    const limit = req.query.limit ?? 5
    const data = await Article.findAll({
      where: { carousel: 1 },
      attributes: [
        "author",
        "poster",
        "updatedAt",
        "title",
        "desc",
        "category",
        "id",
      ],
      limit: Number(limit),
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
    })
    if (JSON.stringify(data) === "[]")
      return res.result(void 0, "获取首页焦点图失败~", false)
    return res.result(data, "获取首页焦点图成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取首页焦点图失败~", false)
    )
  }
})
export default router
