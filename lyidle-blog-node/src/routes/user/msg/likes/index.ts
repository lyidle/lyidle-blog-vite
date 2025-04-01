import express from "express"
import { Op } from "sequelize"
const { LikeDislike, User, Article, Setting, Comment } = require("@/db/models")

const router = express.Router()

// 获取用户的点赞/点踩信息
router.get("/", async (req, res, next) => {
  const targetUserId = req.auth.id
  const { query } = req

  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: {
        targetUserId,
        likeType: "like",
        userId: { [Op.ne]: targetUserId },
      },
      include: [
        {
          model: User,
          as: "user", // 点赞/点踩的用户信息
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
          as: "comment", // 关联的设置信息
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
      likes: rows,
    }

    res.result(result, "获取用户点赞信息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户点赞信息失败", false)
    )
  }
})

export default router
