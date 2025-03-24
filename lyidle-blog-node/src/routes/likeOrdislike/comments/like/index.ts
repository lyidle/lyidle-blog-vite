import express from "express"
// 引入模型
const { LikeDislike, Comment, Article } = require("@/db/models")

const router = express.Router()

// 点赞接口
router.post("/:commentId", async (req, res, next) => {
  const { commentId } = req.params
  const { likeType, articleId } = req.query
  const userId = req.auth.id
  // 校验 commentId 是否合法
  if (!commentId) return res.result(void 0, "commentId必须要有值", false)

  // 校验 likeType 是否合法
  if (!["like", "normal"].includes(likeType as string)) {
    return res.result(void 0, "likeType 必须是 like 或 normal", false)
  }
  // 校验 是否有 articleId
  if (!articleId) return res.result(void 0, "articleId 必须要有值", false)

  // 检查 文章 是否存在
  const article = await Article.findByPk(articleId)
  if (!article) return res.result(void 0, "文章不存在", false)

  // 检查评论是否存在
  const comment = await Comment.findByPk(commentId)
  if (!comment) {
    return res.result(void 0, "评论不存在", false)
  }

  try {
    // 查找或创建记录
    const [record, created] = await LikeDislike.findOrCreate({
      where: {
        userId,
        targetType: "articleComment",
        articleId,
        commentId,
      },
      defaults: {
        commentId,
        articleId,
        userId,
        targetType: "articleComment",
        likeType,
        dislikeType: "normal", // 默认点踩状态为 normal
      },
    })

    // 如果记录已存在，则更新 likeType
    if (!created) {
      record.likeType = likeType
      await record.save()
    }

    // 返回成功响应
    res.result(void 0, "点赞操作成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "点赞操作失败", false)
    )
  }
})
export default router
