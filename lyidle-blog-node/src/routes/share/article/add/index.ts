import express from "express"

// 引入 模型
const { Share, Article } = require("@/db/models")
const router = express.Router()
// 增加文章分享
router.post("/:articleId", async (req, res, next) => {
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

    // 创建分享记录
    await Share.create({
      articleId,
      shareType: "article",
    })

    res.result(void 0, "分享成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () => res.result(void 0, "分享失败", false))
  }
})
export default router
