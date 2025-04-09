import express from "express"

// 引入 模型
const { Message } = require("@/db/models")

const router = express.Router()

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params // 要删除的消息ID
    const userId = req.auth.id // 当前登录用户ID

    // 查找消息
    const message = await Message.findByPk(id)

    if (!message) {
      return res.result(void 0, "消息不存在", false)
    }

    // 验证用户是否有权限删除（只能删除自己发送的消息）
    if (message.senderId !== userId) {
      return res.result(void 0, "不能删除其他人的消息", false)
    }

    // 删除消息
    await message.destroy()

    res.result(void 0, "删除消息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "删除消息失败", false)
    )
  }
})
export default router
