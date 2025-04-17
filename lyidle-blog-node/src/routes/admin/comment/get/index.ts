import express from "express"
const router = express.Router()
// 导入模型
const { Comment } = require("@/db/models")
router.get("/:commentId", async (req, res, next) => {
  const commentId = req.params.commentId
  try {
    const result = await Comment.findByPk(commentId)

    if (!result) return res.result(void 0, "没有查找到评论", false)

    res.result(result, "获取评论成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取评论失败", false)
    )
  }
})
export default router
