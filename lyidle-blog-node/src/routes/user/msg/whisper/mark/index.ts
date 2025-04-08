import { delKey, getKey } from "@/utils/redis"
import express from "express"
const router = express.Router()

// 得到标记状态
router.get("/", async (req, res, next) => {
  try {
    const senderId = req.auth.id

    const { receiverId } = req.query
    // 需要是整数 不能是自身
    if (
      !receiverId ||
      (receiverId && !Number.isInteger(+receiverId)) ||
      senderId === +receiverId
    )
      return res.result(
        void 0,
        "得到对应的用户消息的状态失败,receiverId不合法",
        false
      )
    // 判断是否有新消息
    const result = await getKey(`userMsgTip:${senderId}:${receiverId}`)

    res.result(result || false, "得到对应的用户消息的状态成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "得到对应的用户消息的状态失败", false)
    )
  }
})

// 清除标记状态
router.put("/clear", async (req, res, next) => {
  try {
    const senderId = req.auth.id

    const { receiverId } = req.query

    if (
      !receiverId ||
      (receiverId && !Number.isInteger(+receiverId)) ||
      senderId === +receiverId
    )
      return res.result(
        void 0,
        "清除对应的用户消息的状态失败,receiverId不合法",
        false
      )
    // 判断是否有新消息
    const result = await delKey(`userMsgTip:${senderId}:${receiverId}`)

    res.result(result, "清除对应的用户消息的状态成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "清除对应的用户消息的状态失败", false)
    )
  }
})
export default router
