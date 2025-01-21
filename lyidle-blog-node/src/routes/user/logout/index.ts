import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入类型
import { Request, Response, NextFunction } from "express"
const router = express.Router()
// 引入 redis 设置缓存
const { delKey } = require("@/utils/redis")
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await delKey(`token:${req.auth.id}`)
      res.result(void 0, "退出登录成功~")
    } catch (error) {
      res.result(void 0, "退出登录失败~", false)
    }
  }
)
export default router
