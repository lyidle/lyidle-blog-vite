import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")

const router = express.Router()

// 添加评论
router.get("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId
  try {
    const comments = await Comment.findAll({
      where: {
        articleId,
        fromId: null, // 只查询顶级评论 即文章的 评论
      },
      include: [
        {
          model: User,
          as: "user", // 关联用户
          attributes: ["id", "nickName"], // 只返回用户 ID 和用户名
        },
        {
          model: Comment,
          as: "replies", // 关联回复评论
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "nickName"],
            },
          ],
        },
      ],
    })
    res.result(comments, "查询评论成功")
  } catch (error) {
    res.result(void 0, "查询评论失败")
  }
})
export default router
