import express from "express"
// 引入模型
const { ArticleBookmark, Article } = require("@/db/models")

const router = express.Router()

// 收藏文章接口
router.post("/:articleId", async (req, res, next) => {
  const { articleId } = req.params
  const { isBookmarked = true } = req.body // 默认true表示收藏
  const userId = req.auth.id

  // 校验 isBookmarked 是否合法
  if (typeof isBookmarked !== "boolean") {
    return res.result(void 0, "isBookmarked 必须是布尔值", false)
  }

  // 校验 articleId 是否存在
  if (!articleId) return res.result(void 0, "articleId 必须要有值", false)

  // 检查文章是否存在
  const article = await Article.findByPk(articleId)
  if (!article) return res.result(void 0, "文章不存在", false)

  try {
    // 查找或创建记录
    const [record, created] = await ArticleBookmark.findOrCreate({
      where: {
        userId,
        articleId,
      },
      defaults: {
        userId,
        articleId,
        isBookmarked, // 设置收藏状态
      },
    })

    // 如果记录已存在，则更新 isBookmarked 状态
    if (!created) {
      record.isBookmarked = isBookmarked
      await record.save()
    }

    // 返回成功响应
    res.result(void 0, isBookmarked ? "收藏成功" : "取消收藏成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, isBookmarked ? "收藏失败" : "取消收藏失败", false)
    )
  }
})

export default router
