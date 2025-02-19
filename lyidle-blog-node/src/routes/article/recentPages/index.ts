import express from "express"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 获取最新文章
router.get("/", async (req, res, next) => {
  try {
    const limit = req.query.limit ?? 4
    const result = await Article.findAll({
      attributes: [
        "author",
        "poster",
        "title",
        "createdAt",
        "updatedAt",
        "category",
        "id",
      ],
      limit: Number(limit),
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
    })
    if (!result.dataValues?.length)
      return res.result(void 0, "获取最新文章失败~", false)
    return res.result(result, "获取最新文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取最新文章失败~", false)
    )
  }
})
export default router
