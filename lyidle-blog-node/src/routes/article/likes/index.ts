import express from "express"
const router = express.Router()

// 导入模型
const { LikeDislike } = require("@/db/models")

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params

    // 统计用户的总点赞数
    const likeCount = await LikeDislike.count({
      where: {
        userId,
        likeType: "like",
      },
    })

    res.result(likeCount, "获取用户点赞数量成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户点赞数量失败", false)
    )
  }
})
export default router
