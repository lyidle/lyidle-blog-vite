import express from "express"
// 引入 模型
const { Share, Article } = require("@/db/models")
const router = express.Router()

// 获取文章分享数量
router.get("/:articleId", async (req, res, next) => {
  const { articleId } = req.params

  // 参数校验
  if (!articleId) {
    return res.result(void 0, "articleId 是必传参数", false)
  }

  try {
    // 验证文章是否存在
    const article = await Article.findByPk(articleId)
    if (!article) {
      return res.result(void 0, "文章不存在", false)
    }

    // 获取分享数量
    const count = await Share.count({
      where: {
        articleId,
        shareType: "article",
      },
    })

    res.result(count, "获取分享数量成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取分享数量失败", false)
    )
  }
})

export default router
