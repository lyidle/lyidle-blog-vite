import express from "express"
const {
  Comment,
  User,
  Article,
  Setting,
  Mention,
  sequelize,
} = require("@/db/models")

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
    mentionsUserIds,
    commentId,
  } = req.body

  if (!commentId) return res.result(void 0, "评论id是必传项", false)

  // 验证必填字段
  if (!content) return res.result(void 0, "评论内容不能为空", false)

  // 验证目标存在性（articleId或settingId二选一）
  if (articleId && settingId) {
    return res.result(void 0, "articleId和settingId不能同时存在", false)
  }

  if (!articleId && !settingId) {
    return res.result(void 0, "必须提供articleId或settingId", false)
  }

  if (!link) return res.result(void 0, "必须提供link,用于记录位置信息", false)

  const userId = req.auth.id
  const targetType = articleId ? "article" : "setting"

  // 开启事务
  const transaction = await sequelize.transaction()

  try {
    // 验证目标是否存在
    let targetExists
    if (targetType === "article") {
      targetExists = await Article.findByPk(articleId)
    } else {
      targetExists = await Setting.findByPk(settingId)
    }

    if (!targetExists) {
      await transaction.rollback() // 回滚事务
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
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "被回复的评论不存在", false)
      }

      // 自动获取parentId（如果未提供）
      if (!parentId && parentComment.parentId) {
        parentId = parentComment.parentId
      }
    }

    // 创建评论
    const newComment = await Comment.create(
      {
        userId,
        content,
        fromId: fromId || null,
        parentId: parentId || null,
        link: null, // 先设置为null，创建后再更新
        fromUserId: fromUserId || null,
        articleId: articleId || null,
        settingId: settingId || null,
        targetUserId: targetExists.userId || null,
        commentId,
      },
      {
        transaction,
      }
    )

    // 更新提及的用户表和发布的用户的位置等信息
    await Promise.allSettled([
      ...(mentionsUserIds?.map(async (mentionId: number) => {
        if (!mentionId || !Number.isInteger(mentionId)) return
        return Mention.create(
          {
            userId,
            commentId: newComment.id,
            mentionedUserId: mentionId,
            link,
          },
          {
            transaction,
          }
        )
      }) || []),
      // 更新用户地理位置和UA信息
      User.update(
        {
          userProvince: userProvince || null,
          userAgent: userAgent || null,
        },
        {
          where: { id: userId },
          transaction,
        }
      ),
      (async () => {
        if (link) {
          // 更新link字段，包含新创建的评论ID
          await newComment.update(
            {
              link: link ? (link = `${link}?commentId=${newComment.id}`) : null,
            },
            {
              transaction,
            }
          )
        }
      })(),
    ])

    // 提交事务
    await transaction.commit()

    res.result(newComment, "评论添加成功")
  } catch (error) {
    await transaction.rollback() // 回滚事务
    console.error("评论添加失败:", error)
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论添加失败", false)
    )
  }
})

export default router
