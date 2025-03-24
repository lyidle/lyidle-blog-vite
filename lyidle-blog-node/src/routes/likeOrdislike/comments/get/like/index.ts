import express from "express"
// 引入模型
const { LikeDislike } = require("@/db/models")

const router = express.Router()

// 获取评论的点赞数量
router.get("/:commentId", async (req, res, next) => {
  const { commentId } = req.params

  try {
    // 查询点赞数量
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: {
        targetType: "articleComment",
        commentId,
        likeType: "like", // 只统计点赞的记录
      },
      attributes: ["userId"],
    })

    // 返回结果
    res.result(
      { count, userIds: rows.map((item: any) => item?.userId) },
      "获取评论点赞数量成功"
    )
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取评论点赞数量失败", false)
    )
  }
})
export default router
