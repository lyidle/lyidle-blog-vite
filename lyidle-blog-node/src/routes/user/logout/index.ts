import express from "express"
// 引入验证
import { jwtMiddleware } from "@/middleware/auth"
// 引入类型
import { Request, Response, NextFunction } from "express"
const router = express.Router()
// 引入 redis 设置缓存
import { delKey } from "@/utils/redis"
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await delKey(`user:${req.auth.id}:token`)
      res.result({ token: null }, "退出登录成功~")
    } catch (error) {
      res.result(void 0, "退出登录失败~", false)
    }
  }
)
export default router
