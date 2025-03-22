import express from "express"
// 引入 模型
const { ArticleLikeDislike } = require("@/db/models")

const router = express.Router()
// 点赞接口
router.post("/:articleId", async (req, res, next) => {
  const { articleId } = req.params
  const { likeType } = req.query
  const userId = req.auth.id

  // 校验 likeType 是否合法
  if (!["like", "normal"].includes(likeType as string)) {
    return res.result(void 0, "likeType 必须是 like 或 normal", false)
  }

  try {
    // 查找或创建记录
    const [record, created] = await ArticleLikeDislike.findOrCreate({
      where: {
        userId,
        targetType: "article",
      },
      defaults: {
        userId,
        targetType: "article",
        likeType,
        dislikeType: "normal", // 默认点踩状态为 normal
        articleId, // 关联的文章 ID
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
