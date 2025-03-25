import express from "express"
const { Comment } = require("@/db/models")

const router = express.Router()

// 修改评论接口
router.put("/", async (req, res, next) => {
  const { commentId, content } = req.body
  const userId = req.auth.id // 从认证信息中获取用户ID

  // 验证必填字段
  if (!commentId) return res.result(void 0, "评论ID不能为空", false)
  if (!content) return res.result(void 0, "评论内容不能为空", false)

  try {
    // 直接更新符合条件的评论
    const [affectedRows] = await Comment.update(
      { content }, // 要更新的字段
      {
        where: {
          id: commentId,
          userId: userId, // 确保只能修改自己的评论
        },
      }
    )

    // affectedRows 表示受影响的行数
    if (affectedRows === 0) {
      return res.result(void 0, "评论修改失败", false)
    }

    // 返回成功响应
    res.result(void 0, "评论修改成功")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论修改失败", false)
    )
  }
})

export default router
