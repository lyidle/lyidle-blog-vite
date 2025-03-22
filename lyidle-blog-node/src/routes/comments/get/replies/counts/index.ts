import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")

const router = express.Router()
// 获取评论的回复数量
router.get("/count/:fromId", async (req, res, next) => {
  const fromId = req.params.fromId
  try {
    const count = await Comment.count({
      where: {
        fromId, // 根据 fromId 查询回复数量
      },
    })
    res.result(count, "获取回复数量成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取回复数量失败", false)
    )
  }
})
export default router
