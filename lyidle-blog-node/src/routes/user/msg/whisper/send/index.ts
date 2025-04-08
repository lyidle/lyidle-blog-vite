import { setKey } from "@/utils/redis"
import express from "express"
const router = express.Router()
// 引入 模型
const { Message } = require("@/db/models")

// 发送消息
router.post("/", async (req, res, next) => {
  try {
    const senderId = req.auth.id

    const { receiverId, content } = req.body
    if (!receiverId || !content)
      return res.result(
        void 0,
        "发送消息失败,receiverId、content是必传项",
        false
      )

    const message = await Message.create({ senderId, receiverId, content })

    // 设置消息信息 为true
    console.log("发送-*---------------")
    console.log(`userMsgTip:${senderId}:${receiverId}`)
    await setKey(`userMsgTip:${senderId}:${receiverId}`, true)
    res.result(message, "发送消息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "发送消息失败", false)
    )
  }
})

export default router
