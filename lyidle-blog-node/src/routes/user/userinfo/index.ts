import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入搜素函数
import search from "@/routes/user/search/search"
const router = express.Router()
// 获取当前token用户信息
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      const id = req.auth.id
      // 查询对应id的信息
      await search({ id: id as string }, req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "查询用户信息失败~", false)
      )
    }
  }
)
export default router
