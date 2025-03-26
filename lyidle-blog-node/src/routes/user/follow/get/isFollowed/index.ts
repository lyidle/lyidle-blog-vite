import express from "express"

const router = express.Router()

// 引入 模型
const { Follow } = require("@/db/models")

/**
 * 检查关注
 */
router.get("/:followerId", async (req, res, next) => {
  try {
    // 被关注者id
    let followerId: any = req.params.followerId
    // 需要 关注的 id
    let { followingId }: any = req.query
    followerId = parseInt(followerId)
    followingId = parseInt(followingId)

    if (!followerId || !followingId)
      return res.result(void 0, "关注状态查询失败，followingId是必传项", false)

    if (followerId == followingId)
      return res.result(void 0, "关注状态查询失败,不能查询自身", false)

    const exists = await Follow.findOne({
      where: { followerId, followingId },
      attributes: ["id"], // 只需要返回是否存在
    })

    res.result(
      !!exists, // 转换为布尔值
      "关注状态查询成功"
    )
  } catch (error) {
    console.error("关注状态查询失败:", error)
    res.result(void 0, "查询失败", false)
  }
})
export default router
