import express from "express"
import { Op } from "sequelize"
import { delMark, markMessagesAsRead } from "../../mark"
import { delKey, getKey } from "@/utils/redis"
// 引入模型
const { Message, User } = require("@/db/models")

const router = express.Router()
router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth.id as number
    const { query } = req
    const {
      receiverId,
      isGetReceiverUser = "true",
    }: {
      receiverId: number
      isGetReceiverUser: "true" | "false"
    } = query as any

    // 验证接收者ID是否存在
    if (!receiverId) {
      return res.result(void 0, "获取消息失败：缺少receiverId参数", false)
    }

    // 处理分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    // 准备查询任务
    const queryTasks = [
      // 查询消息分页数据（不包含关联用户）
      Message.findAndCountAll({
        where: {
          [Op.or]: [
            // 发送出去的
            {
              senderId: userId,
              receiverId: receiverId,
            },
            // 接收到的
            {
              senderId: receiverId,
              receiverId: userId,
            },
          ],
        },
        order: [["createdAt", "DESC"]], // 按照创建时间降序排列
        limit: pageSize,
        offset,
        distinct: true,
      }),
    ]

    // 如果需要获取接收者信息，添加到查询任务中
    if (isGetReceiverUser === "true") {
      queryTasks.push(
        User.findByPk(receiverId, {
          attributes: ["id", "account", "nickName", "avatar"],
          paranoid: false,
        })
      )
    }

    // 执行查询
    const [messageResult, receiver] = await Promise.all(queryTasks)

    // 构建返回结果
    const result: any = {
      pagination: {
        total: messageResult.count,
        currentPage,
        pageSize,
      },
      list: messageResult.rows,
    }

    // 如果获取了接收者信息，添加到返回结果中
    if (isGetReceiverUser === "true") {
      result.receiver = receiver
    }

    // 清除消息的标记
    delMark(req)
    // 是有新消息
    const statusKey = `isUserMsgCounts:${userId}`
    const cache = await getKey(statusKey)
    // 有新消息则
    if (cache)
      // 标记对方发来的未读消息为已读
      markMessagesAsRead(userId, receiverId)
    // 成功返回
    res.result(result, "成功获取用户消息列表")
  } catch (error) {
    // 错误处理（保持原有验证逻辑）
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户消息列表失败", false)
    )
  }
})

export default router
