import express from "express"
const { Comment, sequelize, Report } = require("@/db/models")
const { Op } = require("sequelize")

const router = express.Router()

// 删除评论接口
router.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params

  const transaction = await sequelize.transaction()
  try {
    // 1. 先删除所有关联的举报记录
    await Report.destroy({
      where: { commentId },
      transaction,
    })

    // 2. 处理评论的自引用关系（子评论）
    // 将子评论的 fromId 和 parentId 设为 null
    await Comment.update(
      {
        fromId: null,
        parentId: null,
      },
      {
        where: {
          [Op.or]: [{ fromId: commentId }, { parentId: commentId }],
        },
        transaction,
      }
    )

    // 3. 删除评论本身
    const deletedRows = await Comment.destroy({
      where: { id: commentId },
      transaction,
      individualHooks: true,
    })

    // 提交事务
    await transaction.commit()

    if (deletedRows === 0) {
      return res.result(void 0, "评论不存在或删除失败", false)
    }

    res.result(void 0, "评论删除成功")
  } catch (error: any) {
    // 回滚事务
    await transaction.rollback()

    console.error("删除评论失败:", error)

    // 处理特定错误类型
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.result(void 0, "存在关联数据，无法直接删除", false)
    }

    res.validateAuth(error, next, () =>
      res.result(void 0, "评论删除失败", false)
    )
  }
})

export default router
