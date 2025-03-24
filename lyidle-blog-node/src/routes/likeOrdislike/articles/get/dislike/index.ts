import express from "express"
// 引入模型
const { LikeDislike } = require("@/db/models")

const router = express.Router()

// 获取文章的点踩数量
router.get("/:articleId", async (req, res, next) => {
  const { articleId } = req.params

  try {
    // 查询点踩数量
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: {
        targetType: "article",
        articleId,
        dislikeType: "dislike", // 只统计点踩的记录
      },
    })

    // 返回结果
    res.result(
      { count, userIds: rows.map((item: any) => item?.userId) },
      "获取点踩数量成功"
    )
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取点踩数量失败", false)
    )
  }
})

export default router
