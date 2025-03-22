import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")

const router = express.Router()

// 添加评论
router.get("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId
  const { query } = req
  // 决定 评论的 排序
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
        articleId,
        fromId: null, // 只查询顶级评论 即文章的 评论
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
        {
          model: Comment,
          as: "replies", // 关联回复评论
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
          // 只获取 第一条 最新的
          order: [
            ["updatedAt", "desc"],
            ["createdAt", "desc"],
            ["id", "desc"],
          ],
          limit: 1,
        },
      ],
      order: [
        ["updatedAt", "desc"],
        ["createdAt", "desc"],
        ["id", "desc"],
      ],
      limit: pageSize,
      offset,
    })

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      comments: rows,
    }

    res.result(result, "查询评论成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询评论失败", false)
    )
  }
})

export default router
