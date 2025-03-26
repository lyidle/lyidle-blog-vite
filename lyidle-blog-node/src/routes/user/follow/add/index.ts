import express from "express"

const router = express.Router()

// 引入 模型
const { Follow } = require("@/db/models")

// 添加 关注
router.post("/:userId", async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId)
    const currentUserId = req.auth.id

    if (targetUserId === currentUserId) {
      return res.result(void 0, "不能关注自己", false)
    }

    await Follow.findOrCreate({
      where: { followerId: currentUserId, followingId: targetUserId },
    })
    res.result(void 0, "关注成功")
  } catch (error) {
    res.validateAuth(error, next, () => res.result(void 0, "关注失败", false))
  }
})
export default router
