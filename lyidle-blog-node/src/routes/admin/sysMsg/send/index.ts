import express from "express"
const router = express.Router()
// 引入 模型
const { SystemMessage } = require("@/db/models")

router.post("/", async (req, res, next) => {
  const msg = "发送系统消息"
  const { userId, content, title, isAll } = req.body

  if (isAll && userId)
    return res.result(void 0, msg + "失败,全局消息不能有userId参数", false)
  if (!isAll && (!userId || !Number.isInteger(+userId)))
    return res.result(
      void 0,
      msg + "失败,单独发送消息必须要有userId或userId不合法参数",
      false
    )
  try {
    const message = await SystemMessage.create({
      title,
      content,
      userId: userId || null,
    })

    res.result(message, msg + "成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router
