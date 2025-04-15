import express from "express"
const router = express.Router()

// 引入 模型
const { SystemMessage } = require("@/db/models")

router.delete("/:msgId", async (req, res, next) => {
  const msg = "删除系统消息"
  const msgId = req.params.msgId
  try {
    const message = await SystemMessage.findByPk(msgId)
    if (!message) return res.result(void 0, msg + "失败,没有找到消息", false)

    await message.destroy({ force: true })
    res.result(void 0, msg + "成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router
