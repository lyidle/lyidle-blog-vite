import express from "express"
const router = express.Router()
// 导入模型
const { Message } = require("@/db/models")
router.get("/:msgId", async (req, res, next) => {
  const msgId = req.params.msgId
  try {
    const result = await Message.findByPk(msgId)

    if (!result) return res.result(void 0, "没有查找到消息", false)

    res.result(result, "获取消息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取消息失败", false)
    )
  }
})
export default router
