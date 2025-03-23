import express from "express"
// 引入模型
const { ArticleLikeDislike } = require("@/db/models")

const router = express.Router()

// 获取文章的点赞数量
router.get("/:articleId", async (req, res, next) => {
  const { articleId } = req.params

  try {
    // 查询点赞数量
    const { count, rows } = await ArticleLikeDislike.findAndCountAll({
      where: {
        targetType: "article",
        articleId,
        likeType: "like", // 只统计点赞的记录
      },
    })

    // 返回结果
    res.result(
      { count, userIds: rows.map((item: any) => item?.userId) },
      "获取点赞数量成功"
    )
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取点赞数量失败", false)
    )
  }
})
export default router
