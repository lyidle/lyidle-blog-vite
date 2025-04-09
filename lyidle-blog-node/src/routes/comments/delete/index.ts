import express from "express"
const { Comment } = require("@/db/models")

const router = express.Router()

// 删除评论接口
router.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params
  const userId = req.auth.id // 从认证信息中获取用户ID

  // 验证必填字段
  if (!commentId) return res.result(void 0, "评论ID不能为空", false)

  try {
    // 直接删除符合条件的评论
    const deletedRows = await Comment.destroy({
      where: {
        id: commentId,
        userId: userId, // 确保只能删除自己的评论
      },
      individualHooks: true,
    })
    // deletedRows 表示被删除的行数（0 或 1）
    if (deletedRows === 0) {
      return res.result(void 0, "评论删除失败", false)
    }
    // 返回成功响应
    res.result(void 0, "评论删除成功")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论删除失败", false)
    )
  }
})

export default router
