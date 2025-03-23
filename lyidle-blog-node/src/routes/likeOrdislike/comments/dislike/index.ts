import express from "express"
// 引入模型
const { ArticleLikeDislike, Comment } = require("@/db/models")

const router = express.Router()

// 点踩接口
router.post("/:commentId", async (req, res, next) => {
  const { commentId } = req.params
  const { dislikeType, articleId } = req.query
  const userId = req.auth.id

  // 校验 commentId 是否合法
  if (!commentId) return res.result(void 0, "commentId必须要有值", false)

  // 校验 dislikeType 是否合法
  if (!["dislike", "normal"].includes(dislikeType as string)) {
    return res.result(void 0, "dislikeType 必须是 dislike 或 normal", false)
  }
  // 校验 是否有 articleId
  if (!articleId) return res.result(void 0, "articleId 必须要有值", false)
  // 检查评论是否存在
  const comment = await Comment.findByPk(commentId)
  if (!comment) {
    return res.result(void 0, "评论不存在", false)
  }

  try {
    // 查找或创建记录
    const [record, created] = await ArticleLikeDislike.findOrCreate({
      where: {
        userId,
        targetType: "comment",
        articleId,
        commentId,
      },
      defaults: {
        articleId,
        commentId,
        userId,
        targetType: "comment",
        dislikeType,
        likeType: "normal", // 默认点赞状态为 normal
      },
    })

    // 如果记录已存在，则更新 dislikeType
    if (!created) {
      record.dislikeType = dislikeType
      record.articleId = articleId
      await record.save()
    }

    // 返回成功响应
    res.result(void 0, "点踩操作成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "点踩操作失败", false)
    )
  }
})

export default router
