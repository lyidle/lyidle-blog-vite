import express from "express"
import { Op, literal } from "sequelize"
// 引入 api
import details from "./details"
const router = express.Router()
// 引入模型
const { Message, User } = require("@/db/models")

router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth.id

    const { query } = req
    const currentPage = Math.abs(Number(query.currentPage)) || 1 // 当前页码，默认为1
    const pageSize = Math.abs(Number(query.pageSize)) || 10 // 每页数量，默认为10
    const offset = (currentPage - 1) * pageSize // 计算偏移量

    // 1. 获取与当前用户有消息往来的用户ID（分页）
    const userMessages = await Message.findAll({
      attributes: [
        [
          literal(
            `CASE WHEN senderId = ${userId} THEN receiverId ELSE senderId END`
          ),
          "otherUserId", // 对方用户ID
        ],
        [literal(`MAX(createdAt)`), "latestMessageTime"], // 最新消息时间
      ],
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }], // 发送方或接收方是当前用户
      },
      group: ["otherUserId"], // 按对方用户ID分组
      order: [[literal("latestMessageTime"), "DESC"]], // 按最新消息时间降序
      limit: pageSize,
      offset,
      raw: true,
    })

    // 如果没有消息，直接返回空结果
    if (userMessages.length === 0) {
      return res.result(
        {
          pagination: {
            total: 0, // 总会话数为0
            currentPage, // 当前页码
            pageSize, // 每页数量
          },
          list: [], // 空列表
        },
        "获取消息列表成功"
      )
    }

    const otherUserIds = userMessages.map((item) => item.otherUserId) // 提取对方用户ID数组

    // 2. 获取这些用户的基本信息
    const otherUsers = await User.findAll({
      where: {
        id: {
          [Op.in]: otherUserIds, // 用户ID在对方用户ID数组中
        },
      },
      attributes: ["id", "account", "nickName", "signer", "avatar"], // 只查询需要的字段
      raw: true,
    })

    // 3. 获取每个用户与当前用户之间的最新一条消息
    // 修复了这里SQL语法错误，补全了括号
    const latestMessages = await Message.findAll({
      where: {
        id: {
          [Op.in]: literal(`(
            SELECT MAX(m.id)
            FROM Messages AS m
            WHERE (m.senderId = ${userId} AND m.receiverId IN (${otherUserIds.join(
            ","
          )}))
               OR (m.senderId IN (${otherUserIds.join(
                 ","
               )}) AND m.receiverId = ${userId})
            GROUP BY CASE 
              WHEN m.senderId = ${userId} THEN m.receiverId 
              ELSE m.senderId 
            END
          )`),
        },
      },
      order: [["createdAt", "DESC"]], // 按创建时间降序
      raw: true,
    })

    // 4. 获取总会话数（用于分页）
    const [[{ totalUsers }]] = await Message.sequelize.query(
      `
      SELECT COUNT(DISTINCT CASE 
        WHEN senderId = :userId THEN receiverId 
        ELSE senderId 
      END) AS totalUsers
      FROM Messages
      WHERE senderId = :userId OR receiverId = :userId
      `,
      {
        replacements: { userId }, // 使用参数化查询防止SQL注入
      }
    )

    // 5. 组装返回列表（合并用户信息和对应消息）
    const list = otherUsers.map((user) => {
      // 查找该用户与当前用户之间的最新消息
      const latestMessage = latestMessages.find(
        (msg) =>
          (msg.senderId === user.id && msg.receiverId === userId) ||
          (msg.receiverId === user.id && msg.senderId === userId)
      )
      return {
        user, // 用户信息
        message: latestMessage || null, // 最新消息或null
      }
    })

    // 6. 返回最终结果
    const result = {
      pagination: {
        total: totalUsers, // 总会话数
        currentPage, // 当前页码
        pageSize, // 每页数量
      },
      list, // 消息列表
    }

    res.result(result, "获取消息列表成功")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取消息列表失败", false)
    )
  }
})
router.use("/details", details)
export default router
