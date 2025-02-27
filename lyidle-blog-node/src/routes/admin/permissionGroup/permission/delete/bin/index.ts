import express from "express"
// 引入移除函数
import remove from "@/routes/admin/permissionGroup/permission/delete/remove"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { isAdmin, jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { getKey } from "@/utils/redis"
const router = express.Router()

// 需要验证 登录用户拥有权限 admin
router.delete(
  "/manager",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.body
      // 判断是否 移动到垃圾桶
      const isBin = await getKey(`permissionsBin:${articleId}`)
      if (isBin)
        return res.result(
          void 0,
          "权限子菜单移动到垃圾桶了，请勿重复操作~",
          false
        )

      await remove(req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "权限子菜单移动到回收站失败~", false)
      )
    }
  }
)
export default router
