import express from "express"
// 引入移除函数
import remove from "@/routes/admin/menuList/delete/remove"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入redis
import { getKey } from "@/utils/redis"
const router = express.Router()
// 彻底删除
router.delete(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: menuListId } = req.body
      // 判断是否 移动到垃圾桶
      const isBin = await getKey(`userMenusBin:${menuListId}`)
      if (isBin)
        return res.result(void 0, "菜单移动到垃圾桶了，请勿重复操作~", false)

      await remove(req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "菜单移动到回收站失败~", false)
      )
    }
  }
)
// 不需要验证 登录用户拥有权限
router.delete(
  "/manager",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: menuListId } = req.body
      // 判断是否 移动到垃圾桶
      const isBin = await getKey(`userMenusBin:${menuListId}`)
      if (isBin)
        return res.result(void 0, "菜单移动到垃圾桶了，请勿重复操作~", false)

      await remove(req, res, true, false)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "菜单移动到回收站失败~", false)
      )
    }
  }
)
export default router
