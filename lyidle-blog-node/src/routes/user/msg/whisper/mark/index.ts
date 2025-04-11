import { delKey, getKey } from "@/utils/redis"
import express, { Request } from "express"
const router = express.Router()

// 引入模型
const { Message } = require("@/db/models")

// 得到标记状态 两个用户之间的
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
    const result = await getKey(`userMsgTip:${receiverId}:${senderId}`)

    res.result(result || false, "得到对应的用户消息的状态成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "得到对应的用户消息的状态失败", false)
    )
  }
})

// 得到是否有新消息 发起请求的用户
router.get("/isNewUserMsg", async (req, res, next) => {
  try {
    const userId = req.auth.id

    // 是有新消息
    const result = await getKey(`isUserMsgCounts:${userId}`)

    res.result(result || false, "得到对应的用户消息的状态成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "得到对应的用户消息的状态失败", false)
    )
  }
})

// 清除消息状态
router.delete("/delNewUserMsg", async (req, res, next) => {
  try {
    const userId = req.auth.id
    await Message.update(
      { isRead: true },
      {
        where: {
          receiverId: userId, // 当前用户是接收者
          isRead: false, // 只更新未读消息
        },
      }
    )
    // 清除本人的消息
    await delKey(`isUserMsgCounts:${userId}`)
    res.result(void 0, "清除对应的用户消息的状态成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "清除对应的用户消息的状态失败", false)
    )
  }
})

// 清除标记状态
export const delMark = async (req: Request) => {
  const cacheKey = `userMsgTip:${req.query.receiverId}:${req.auth.id}`
  try {
    const senderId = req.auth.id

    const { receiverId } = req.query

    if (
      !receiverId ||
      (receiverId && !Number.isInteger(+receiverId)) ||
      senderId === +receiverId
    ) {
      console.warn("清除对应的用户消息的状态失败,receiverId不合法", cacheKey)
      return
    }
    // 清除消息的状态
    await delKey(cacheKey)
  } catch (error) {
    console.warn("清除对应的用户消息的状态失败", cacheKey)
  }
}

/**
 * 标记指定对话的未读消息为已读（不返回响应，仅执行更新）
 * @param {number} userId - 当前用户ID（消息接收者）
 * @param {number} senderId - 对方用户ID（消息发送者）
 */
export const markMessagesAsRead = async (userId: number, senderId: number) => {
  try {
    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: senderId, // 对方发的消息
          receiverId: userId, // 当前用户是接收者
          isRead: false, // 只更新未读消息
        },
      }
    )
    // 清除本人的消息
    await delKey(`isUserMsgCounts:${userId}`)
  } catch (error) {
    console.error("标记消息为已读失败:", error)
  }
}

export default router
