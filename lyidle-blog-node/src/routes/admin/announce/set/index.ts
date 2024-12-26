import express from "express"
// 类型
import type { Request, Response, NextFunction } from "express"
// 引入权限判断
import { jwt, jwtExpand, isAdmin } from "@/middleware/auth"
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwt, jwtExpand, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
)
export default router
