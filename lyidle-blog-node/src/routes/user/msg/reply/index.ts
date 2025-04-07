import express from "express"
import { Op } from "sequelize"

// 引入模型
const { Comment, User, Article, Setting } = require("@/db/models")

const router = express.Router()
// 获取用户的回复信息
router.get("/", async (req, res, next) => {
  const userId = req.auth.id
  const { query } = req

  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        [Op.or]: {
          targetUserId: userId,
          fromUserId: userId,
        },
        [Op.not]: {
          // 不能是自身
          userId,
        },
      },
      include: [
        {
          model: User,
          as: "user", // 评论作者信息
          attributes: ["id", "account", "nickName", "avatar"],
        },
        {
          model: Article,
          as: "article", // 关联的文章信息
          attributes: ["id", "title", "updatedAt"],
          required: false,
        },
        {
          model: Setting,
          as: "setting", // 关联的设置信息
          attributes: ["id", "name", "updatedAt"],
          required: false,
        },
        {
          model: Comment,
          as: "parentComment", // 父评论信息
          required: false,
          attributes: ["id", "content", "link"],
        },
        {
          model: Comment,
          as: "fromComment", // 关联来源评论
          include: [
            {
              model: User,
              as: "user", // 来源评论的用户信息
              attributes: ["id", "account", "nickName", "avatar"],
            },
          ],
          attributes: ["id", "content", "link"],
          required: false,
        },
      ],
      order: [
        ["updatedAt", "desc"], // 按更新时间降序排列
        ["id", "desc"], // 如果更新时间相同，按ID降序
      ],
      limit: pageSize,
      offset,
      distinct: true,
    })

    // 返回结果
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      replies: rows,
    }

    res.result(result, "获取用户回复信息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户回复信息失败", false)
    )
  }
})

export default router
