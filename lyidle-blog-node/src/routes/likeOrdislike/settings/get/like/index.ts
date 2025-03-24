import express from "express"
// 引入模型
const { LikeDislike } = require("@/db/models")

const router = express.Router()

// 获取设置 文章 的点赞数量
router.get("/:commentId", async (req, res, next) => {
  const { commentId } = req.params

  // 非空 判断
  if (!commentId) return res.result(void 0, "commentId 是必传项", false)

  try {
    // 查询点赞数量
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: {
        targetType: "setting",
        commentId,
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
