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

// 查询评论
router.get("/", async (req, res, next) => {
  const { query } = req
  // 决定 评论的 排序
  let {
    order = "desc",
    key = "new",
    articleId,
    settingId,
  } = query as {
    order: orderType
    key: orderKeyType
    articleId: string | number
    settingId: string | number
  }

  // 判断是否冲突
  if (articleId && settingId)
    return res.result(
      void 0,
      "查询怕评论时，articleId和settingId不能同时存在",
      false
    )

  // 判断是否冲突
  if (!articleId && !settingId)
    return res.result(
      void 0,
      "查询怕评论时，articleId和settingId至少需要有一个",
      false
    )

  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  // 判断 是查询 设置还是文章
  const articleOrSetting: any = {}
  if (articleId) articleOrSetting.articleId = articleId
  if (settingId) articleOrSetting.settingId = settingId

  try {
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        ...articleOrSetting,
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
          required: true,
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
      ],
      order: handlerOrder(order, key),
      limit: pageSize,
      offset,
      distinct: true, // 避免重复计数
    })

    // 返回 结果
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
