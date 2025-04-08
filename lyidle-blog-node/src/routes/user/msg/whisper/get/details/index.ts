import express from "express"
import { Op } from "sequelize"
import { delMark } from "../../mark"
// 引入模型
const { Message, User } = require("@/db/models")

const router = express.Router()
router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth.id
    const { query } = req
    const { receiverId } = query

    // 验证接收者ID是否存在
    if (!receiverId) {
      return res.result(void 0, "获取消息失败：缺少receiverId参数", false)
    }

    // 处理分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    // 使用Promise.all并行执行三个查询
    const [messageResult, receiver] = await Promise.all([
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
      // 查询接收者信息
      User.findByPk(receiverId, {
        attributes: ["id", "account", "nickName", "avatar"],
      }),
    ])

    // 构建返回结果
    const result = {
      pagination: {
        total: messageResult.count,
        currentPage,
        pageSize,
      },
      receiver,
      list: messageResult.rows,
    }
    // 清除消息的标记
    delMark(req)
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
