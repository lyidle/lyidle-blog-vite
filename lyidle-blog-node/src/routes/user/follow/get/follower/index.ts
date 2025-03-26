import express from "express"

const router = express.Router()

// 引入 模型
const { Follow, User } = require("@/db/models")

// 获取 粉丝列表
router.get("/", async (req, res, next) => {
  try {
    const { query } = req
    let { userId }: any = query
    if (!userId)
      return res.result(void 0, "获取粉丝列表失败,userId是必传项", false)

    userId = parseInt(userId as string)
    /**
     * @pagesize 每页显示条目个数
     * @currentPage 当前页
     */
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const { count, rows } = await Follow.findAndCountAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: "follower",
          attributes: ["id", "nickname", "avatar"],
        },
      ],
      limit: pageSize,
      offset,
    })

    res.result(
      {
        pagination: {
          total: count,
          currentPage,
          pageSize,
        },
        users: rows,
      },
      "获取粉丝列表成功"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取粉丝列表失败", false)
    )
  }
})
export default router
