import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"

// 引入模型
const { Comment, User } = require("@/db/models")

const router = express.Router()
// 获取用户的回复信息
router.get("/", jwtMiddleware, async (req, res, next) => {
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
        // 查询回复该用户的评论
        fromUserId: userId,
      },
      include: [
        {
          model: User,
          as: "user", // 评论作者信息
          attributes: ["id", "account", "nickName", "avatar"],
        },
        {
          model: Comment,
          as: "parentComment", // 父评论信息
          include: [
            {
              model: User,
              as: "user", // 父评论的用户信息
              attributes: ["id", "account", "nickName", "avatar"],
            },
          ],
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
