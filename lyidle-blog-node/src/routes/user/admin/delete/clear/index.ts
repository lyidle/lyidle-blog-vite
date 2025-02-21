import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入删除函数
import remove from "@/routes/user/admin/delete/remove"
// 引入 jwt
import { isAdmin, jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 彻底删除
router.delete(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.auth
    try {
      await remove(req, res, +id)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除用户失败~", false)
      )
    }
  }
)

// 不需要验证 角色信息
// 需要验证 登录用户拥有权限 admin
router.delete(
  "/manager",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.body
    try {
      await remove(req, res, id, false, false)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除用户失败~", false)
      )
    }
  }
)
export default router
