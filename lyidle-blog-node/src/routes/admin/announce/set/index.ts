import express from "express"
// 引入jwt
import { jwt } from "@/middleware/auth"
// 引入管理权限判断
import { admin } from "@/middleware/auth"
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.put("/", jwt, admin, async (req, res, next) => {
  try {
    const result = { content: req.body.announce }
    // 更新通知
    await Setting.update(result, {
      where: { name: "announce" },
    })
    return res.result({ msg: req.body.announce }, "设置通知成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "设置通知失败~", false)
    )
  }
})
export default router
