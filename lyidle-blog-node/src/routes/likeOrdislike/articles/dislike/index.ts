import express from "express"
// 引入 模型
const { LikeDislike, Article } = require("@/db/models")

const router = express.Router()

// 点踩接口
router.post("/:articleId", async (req, res, next) => {
  const { articleId } = req.params
  const { dislikeType, targetUserId } = req.query
  const userId = req.auth.id

  // 校验 dislikeType 是否合法
  if (!["dislike", "normal"].includes(dislikeType as string)) {
    return res.result(void 0, "dislikeType 必须是 dislike 或 normal", false)
  }

  // 校验 是否有 articleId
  if (!articleId) return res.result(void 0, "articleId 必须要有值", false)

  // 检查 文章 是否存在
  const article = await Article.findByPk(articleId)
  if (!article) return res.result(void 0, "文章不存在", false)

  try {
    // 查找或创建记录
    const [record, created] = await LikeDislike.findOrCreate({
      where: {
        userId,
        targetType: "article",
        articleId,
        targetUserId,
      },
      defaults: {
        userId,
        targetType: "article",
        dislikeType,
        likeType: "normal", // 默认点赞状态为 normal
        articleId, // 关联的文章 ID
        targetUserId,
      },
    })

    // 如果记录已存在，则更新 dislikeType
    if (!created) {
      record.dislikeType = dislikeType
      await record.save()
    }

    // 返回成功响应
    res.result(void 0, `${dislikeType === "normal" ? "取消" : ""}点踩操作成功`)
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(
        void 0,
        `${dislikeType === "normal" ? "取消" : ""}点踩操作失败`,
        false
      )
    )
  }
})
export default router
