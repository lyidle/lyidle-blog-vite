import express from "express"
const { Message, sequelize, Report } = require("@/db/models")

const router = express.Router()

// 删除消息接口
router.delete("/:msgId", async (req, res, next) => {
  const { msgId } = req.params

  // 开启事务确保数据一致性
  const transaction = await sequelize.transaction()
  try {
    // 1. 先删除关联的举报记录（如果有）
    await Report.destroy({
      where: { msgId },
      transaction,
    })

    // 2. 删除消息本身
    const deletedRows = await Message.destroy({
      where: { id: msgId },
      transaction,
      individualHooks: true,
    })

    // 提交事务
    await transaction.commit()

    // 检查是否成功删除
    if (deletedRows === 0) {
      return res.result(void 0, "消息不存在或删除失败", false)
    }

    // 返回成功响应
    res.result(void 0, "消息删除成功")
  } catch (error: any) {
    // 回滚事务
    await transaction.rollback()

    console.error("删除消息失败:", error)

    // 处理特定错误类型
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.result(void 0, "存在关联数据，无法直接删除", false)
    }

    // 通用的错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "消息删除失败", false)
    )
  }
})

export default router
