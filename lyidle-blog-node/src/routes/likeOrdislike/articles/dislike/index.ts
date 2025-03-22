import express from "express"
// 引入 模型
const { ArticleLikeDislike } = require("@/db/models")

const router = express.Router()

// 点踩接口
router.post("/:articleId", async (req, res, next) => {
  const { articleId } = req.params
  const { dislikeType } = req.query
  const userId = req.auth.id

  // 校验 dislikeType 是否合法
  if (!["dislike", "normal"].includes(dislikeType as string)) {
    return res.result(void 0, "dislikeType 必须是 dislike 或 normal", false)
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
        dislikeType,
        likeType: "normal", // 默认点赞状态为 normal
        articleId, // 关联的文章 ID
      },
    })

    // 如果记录已存在，则更新 dislikeType
    if (!created) {
      record.dislikeType = dislikeType
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
