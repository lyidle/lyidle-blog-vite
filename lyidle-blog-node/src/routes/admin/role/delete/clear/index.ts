import express from "express"
// 引入移除函数
import remove from "@/routes/admin/role/delete/remove"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 彻底删除
router.delete(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await remove(req, res)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除角色失败~", false)
      )
    }
  }
)

// 不需要验证 角色信息
// 需要验证 登录用户拥有权限 admin
router.delete(
  "/manager",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await remove(req, res, false, false)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除角色失败~", false)
      )
    }
  }
)
export default router
