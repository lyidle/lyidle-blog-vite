import express from "express"
// 引入 模型
const { Comment } = require("@/db/models")

const router = express.Router()

// 添加评论
router.post("/", async (req, res, next) => {
  const { articleId, content, fromId } = req.body
  if (!articleId || !content)
    return res.result(void 0, "添加评论时，articleId、content是必传项", false)

  try {
    // 创建评论
    const comment = await Comment.create({
      userId: req.auth.id,
      articleId,
      content,
      fromId: fromId || null, // 顶级评论，fromId 为 null
    })
    res.result(comment, "评论添加成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论添加失败", false)
    )
  }
})
export default router
