import express from "express"
// 引入模型
const { LikeDislike, Comment, Article } = require("@/db/models")

const router = express.Router()

// 点赞接口
router.post("/:commentId", async (req, res, next) => {
  const { commentId } = req.params
  const { likeType, articleId, settingId, targetUserId } = req.query
  const userId = req.auth.id
  // 校验 commentId 是否合法
  if (!commentId) return res.result(void 0, "commentId必须要有值", false)

  // 校验 likeType 是否合法
  if (!["like", "normal"].includes(likeType as string)) {
    return res.result(void 0, "likeType 必须是 like 或 normal", false)
  }
  // 校验
  if (!articleId && !settingId)
    return res.result(void 0, "articleId、settingId必须有一个", false)
  if (articleId && settingId)
    return res.result(void 0, "articleId、settingId不能同时存在", false)

  // 检查评论是否存在
  const comment = await Comment.findByPk(commentId)
  if (!comment) {
    return res.result(void 0, "评论不存在", false)
  }

  try {
    const whereCommend: any = {
      userId,
      targetType: "comment",
      commentId,
      targetUserId,
    }
    if (articleId) whereCommend.articleId = articleId
    if (settingId) whereCommend.settingId = settingId
    const defaultCommend: any = {
      commentId,
      userId,
      targetType: "comment",
      likeType,
      dislikeType: "normal", // 默认点踩状态为 normal
      targetUserId,
    }
    if (articleId) defaultCommend.articleId = articleId
    if (settingId) defaultCommend.settingId = settingId

    // 查找或创建记录
    const [record, created] = await LikeDislike.findOrCreate({
      where: whereCommend,
      defaults: defaultCommend,
    })

    // 如果记录已存在，则更新 likeType
    if (!created) {
      record.likeType = likeType
      await record.save()
    }

    // 返回成功响应
    res.result(void 0, `${likeType === "normal" ? "取消" : ""}点赞操作成功`)
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(
        void 0,
        `${likeType === "normal" ? "取消" : ""}点赞操作失败`,
        false
      )
    )
  }
})
export default router
