import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")

const router = express.Router()
// 获取评论的回复分页数据
router.get("/pagination/:fromId", async (req, res, next) => {
  const fromId = req.params.fromId
  const { query } = req
  // 决定 回复的 排序
  const { order } = query
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
        fromId, // 根据 fromId 查询回复
      },
      include: [
        {
          model: User,
          as: "user", // 关联用户
          attributes: [
            "id",
            "account",
            "nickName",
            "avatar",
            "userProvince",
            "userAgent",
          ],
        },
      ],
      limit: pageSize,
      offset,
      order: [
        ["updatedAt", "desc"],
        ["createdAt", "desc"],
        ["id", "desc"],
      ],
    })

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      replies: rows,
    }
    res.result(result, "获取回复分页数据成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取回复分页数据失败", false)
    )
  }
})

export default router
