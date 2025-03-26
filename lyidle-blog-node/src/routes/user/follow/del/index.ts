import express from "express"

const router = express.Router()

// 引入 模型
const { Follow } = require("@/db/models")

// 取消 关注
router.delete("/:userId", async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId)
    const currentUserId = req.auth.id

    const result = await Follow.destroy({
      where: { followerId: currentUserId, followingId: targetUserId },
    })

    if (result > 0) {
      res.result(void 0, "已取消关注")
    } else {
      res.result(void 0, "未找到关注关系", false)
    }
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "取消关注失败", false)
    )
  }
})
export default router
