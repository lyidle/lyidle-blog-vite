import express from "express"
// 引入 模型
const { LikeDislike, Setting } = require("@/db/models")

const router = express.Router()

// 点踩接口
router.post("/:commentId", async (req, res, next) => {
  const { commentId } = req.params
  const { dislikeType, settingId } = req.query
  const userId = req.auth.id

  // 验证 是否有 commentId
  if (!commentId) return res.result(void 0, "commentId 是必传项", false)

  // 校验 likeType 是否合法
  if (!["dislike", "normal"].includes(dislikeType as string)) {
    return res.result(void 0, "dislikeType 必须是 dislike 或 normal", false)
  }

  // 校验 是否有 settingId
  if (!settingId) return res.result(void 0, "settingId 必须要有值", false)

  // 检查 设置 是否存在
  const setting = await Setting.findByPk(settingId)
  if (!setting) return res.result(void 0, "设置不存在", false)

  try {
    // 查找或创建记录
    const [record, created] = await LikeDislike.findOrCreate({
      where: {
        userId,
        targetType: "settingComment",
        settingId,
        commentId,
      },
      defaults: {
        userId,
        targetType: "settingComment",
        dislikeType,
        likeType: "normal", // 默认点赞状态为 normal
        commentId,
        settingId,
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
