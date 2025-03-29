import express from "express"
const { Comment, User, Article, Setting } = require("@/db/models")

const router = express.Router()

// 添加评论
router.post("/", async (req, res, next) => {
  let {
    content,
    fromId,
    parentId,
    userProvince,
    userAgent,
    link,
    fromUserId,
    articleId,
    settingId,
  } = req.body

  // 验证必填字段
  if (!content) return res.result(void 0, "评论内容不能为空", false)

  // 验证目标存在性（articleId或settingId二选一）
  if (articleId && settingId) {
    return res.result(void 0, "articleId和settingId不能同时存在", false)
  }

  if (!articleId && !settingId) {
    return res.result(void 0, "必须提供articleId或settingId", false)
  }

  const userId = req.auth.id
  const targetType = articleId ? "article" : "setting"

  try {
    // 验证目标是否存在
    let targetExists
    if (targetType === "article") {
      targetExists = await Article.findByPk(articleId)
    } else {
      targetExists = await Setting.findByPk(settingId)
    }

    if (!targetExists) {
      return res.result(
        void 0,
        `${targetType === "article" ? "文章" : "设置项"}不存在`,
        false
      )
    }

    // 验证被回复评论是否存在（如果fromId存在）
    if (fromId) {
      const parentComment = await Comment.findByPk(fromId)
      if (!parentComment) {
        return res.result(void 0, "被回复的评论不存在", false)
      }

      // 自动获取parentId（如果未提供）
      if (!parentId && parentComment.parentId) {
        parentId = parentComment.parentId
      }
    }

    // 创建评论
    const newComment = await Comment.create({
      userId,
      content,
      fromId: fromId || null,
      parentId: parentId || null,
      link: link || null,
      fromUserId: fromUserId || null,
      articleId: articleId || null,
      settingId: settingId || null,
      targetUserId: targetExists.userId || null,
    })

    // 更新用户地理位置和UA信息（非必须操作）
    try {
      await User.update(
        {
          userProvince: userProvince || null,
          userAgent: userAgent || null,
        },
        {
          where: { id: userId },
        }
      )
    } catch (error) {}

    res.result(newComment, "评论添加成功")
  } catch (error) {
    console.error("评论添加失败:", error)
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论添加失败", false)
    )
  }
})

export default router
