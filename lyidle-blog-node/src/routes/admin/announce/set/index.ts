import express from "express"
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.put("/", async (req, res) => {
  const result = { content: req.body.announce }
  // 更新通知
  await Setting.update(result, {
    where: { name: "announce" },
  })
  return res.result({ msg: req.body.announce }, "设置通知成功")
})
export default router
