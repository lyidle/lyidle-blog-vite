import express from "express"
const router = express.Router()
// 引入模型
const { Message } = require("@/db/models")

router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth.id

    // 查询未读消息的对话数量
    const [[{ totalUnreadConversations }]] = await Message.sequelize.query(
      `
      SELECT COUNT(DISTINCT CASE 
        WHEN senderId = :userId THEN receiverId 
        ELSE senderId 
      END) AS totalUnreadConversations
      FROM Messages
      WHERE (senderId = :userId OR receiverId = :userId)
      AND isRead = false
      AND receiverId = :userId  -- 只有接收者才有未读概念
      `,
      {
        replacements: { userId },
      }
    )

    res.result(totalUnreadConversations, "获取未读对话数量成功")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取未读对话数量失败", false)
    )
  }
})

export default router
