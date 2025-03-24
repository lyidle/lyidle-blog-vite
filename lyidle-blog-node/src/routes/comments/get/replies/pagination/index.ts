import express from "express"
// 引入 模型
const { Comment, LikeDislike, User, sequelize } = require("@/db/models")

const router = express.Router()

// 降序 升序
type orderType = "desc" | "asc"
// 最新 最晚 最热
type orderKeyType = "new" | "like"

// 处理 排序
const handlerOrder = (order: orderType, key: orderKeyType) => {
  if (key === "like") {
    // 按照点赞数量排序
    return [
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM LikeDislikes WHERE LikeDislikes.commentId = Comment.id AND LikeDislikes.likeType = "like")'
        ),
        order,
      ],
    ]
  } else {
    // 默认排序
    return [
      ["updatedAt", order],
      ["createdAt", order],
      ["id", order],
    ]
  }
}

// 获取评论的回复分页数据
router.get("/pagination/:parentId", async (req, res, next) => {
  const parentId = req.params.parentId
  const { query } = req
  // 决定 回复的 排序
  const { order = "desc", key = "new" } = query as {
    order: orderType
    key: orderKeyType
  }
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
        parentId, // 根据 parentId 查询回复
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
          model: LikeDislike,
          as: "likes", // 关联点赞
          attributes: [], // 不需要返回点赞的具体信息
          where: {
            likeType: "like", // 只计算点赞
          },
          required: false, // 左连接
        },
        {
          model: Comment,
          as: "replies", // 关联父评论
          include: [
            {
              model: User,
              as: "user", // 父评论的用户信息
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
          required: false, // 左连接
        },
      ],
      order: handlerOrder(order, key), // 根据 order 和 key 排序
      limit: pageSize,
      offset,
    })

    // 返回 结果
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
