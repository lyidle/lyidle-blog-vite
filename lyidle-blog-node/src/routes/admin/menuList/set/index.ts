import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 设置 redis 缓存
import { delKey } from "@/utils/redis"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Menu } = require("@/db/models")
const router = express.Router()
// 清除 菜单 的缓存
export const delRoles = async (roles: string[]) => {
  if (roles && roles.length) {
    // 清除 redis 缓存
    await Promise.all(roles.map((item: string) => delKey(`menu:${item}`)))
  }
}
// 用户角色用户组
const default_user = JSON.parse(process.env.default_user!)
// 创建菜单
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, icon, layout, role, parentId } = req.body

    if (!name && !icon && !layout && !role)
      return res.result(
        void 0,
        "创建菜单至少需要name、icon、layout、role其中的一个参数哦~",
        false
      )
    try {
      const setData = {
        name,
        icon,
        layout,
        role: role?.length ? role : default_user,
        parentId,
      }

      // 创建菜单
      let { dataValues } = await Menu.create(setData)

      // 得到 roles
      const roles = dataValues.role
      // 清除 菜单 的缓存
      await delRoles(roles)
      res.result(void 0, "创建菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建菜单失败~", false)
      )
    }
  }
)
export default router
