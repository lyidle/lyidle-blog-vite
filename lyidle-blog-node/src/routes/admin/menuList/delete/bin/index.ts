import express from "express"
// 引入移除函数
import remove from "@/routes/admin/menuList/delete/remove"
// 引入类型
import type { NextFunction, Request, Response } from "express"
const router = express.Router()
// 需要验证 登录用户拥有权限 admin
router.delete(
  "/manager",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await remove(req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "菜单移动到回收站失败~", false)
      )
    }
  }
)
export default router
