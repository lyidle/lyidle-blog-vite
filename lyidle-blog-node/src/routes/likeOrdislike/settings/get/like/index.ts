import express from "express"
// 引入模型
const { LikeDislike } = require("@/db/models")

const router = express.Router()

// 获取设置 文章 的点赞数量
router.get("/:settingId", async (req, res, next) => {
  const { settingId } = req.params

  // 非空 判断
  if (!settingId) return res.result(void 0, "settingId 是必传项", false)

  try {
    // 查询点赞数量
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: {
        targetType: "setting",
        settingId,
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
