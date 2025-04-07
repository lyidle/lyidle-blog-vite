import express from "express"

const router = express.Router()

const { Mention, User, Comment, Article, Setting } = require("@/db/models")

router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth.id

    const { query } = req

    /**
     * @pagesize 每页显示条目个数
     * @currentPage 当前页
     */
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const { count, rows } = await Mention.findAndCountAll({
      where: {
        mentionedUserId: userId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "account", "nickName", "avatar"],
        },
        {
          model: Comment,
          as: "comment",
        },
      ],
      order: [
        ["createdAt", "desc"],
        ["id", "desc"],
      ],
      limit: pageSize,
      offset,
      distinct: true, // 避免重复计数
    })

    // 格式化数据，便于客户端使用
    const formattedMentions = rows.map((mention) => ({
      id: mention.id,
      createdAt: mention.createdAt,
      link: mention.comment.link,
      // 谁提及的
      mentionedBy: mention.user,
      comment: mention.comment,
    }))

    // 返回结果
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      list: formattedMentions,
    }
    res.result(result, "获取at的信息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取at的信息失败", false)
    )
  }
})
export default router
