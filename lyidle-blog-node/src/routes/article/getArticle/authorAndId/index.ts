import express from "express"
const router = express.Router()
// 导入模型
const { Article } = require("@/db/models")
router.get("/", async (req, res, next) => {
  const id = req.query.id
  const author = req.query.author
  if (!id || !author) return res.result(void 0, "id、author是必传项", false)

  try {
    const result = await Article.findOne({
      attributes: { exclude: ["UserId"] },
      where: { id, author },
    })

    if (!result) return res.result(void 0, "没有查找到文章", false)
    if (result.dataValues.isBin)
      return res.result(void 0, "文章被删除了", false)

    res.result(result, "获取文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取文章失败", false)
    )
  }
})
export default router
