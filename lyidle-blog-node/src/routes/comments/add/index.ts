import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")

const router = express.Router()

// 添加评论
router.post("/", async (req, res, next) => {
  const { articleId, content, fromId, parentId, userProvince, userAgent } =
    req.body
  if (!articleId || !content)
    return res.result(void 0, "添加评论时，articleId、content是必传项", false)
  const userId = req.auth.id
  try {
    // 创建评论
    const comment = await Comment.create({
      userId,
      articleId,
      content,
      fromId: fromId || null, // 顶级评论，fromId 为 null
      parentId: parentId || null, // 顶级评论，parentId 为 null
    })
    try {
      // 更新 用户
      await User.update(
        { userProvince: userProvince || null, userAgent: userAgent || null },
        { where: { id: userId } }
      )
    } catch (error) {}
    res.result(comment, "评论添加成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论添加失败", false)
    )
  }
})
export default router
