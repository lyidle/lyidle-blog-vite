import express from "express"
// 类型
import type { Request, Response, NextFunction } from "express"
// 引入权限判断
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入redis 更新缓存
const { setKey } = require("@/utils/redis")
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { announce } = req.body
      const result = { content: announce }
      // 更新通知
      await Setting.update(result, {
        where: { name: "announce" },
      })
      // 更新缓存
      await setKey("announce", announce)
      return res.result(void 0, "设置通知成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置通知失败~", false)
      )
    }
  }
)
export default router
