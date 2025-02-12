import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 设置 redis 缓存
import { delKey } from "@/utils/redis"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { setRoles } from "@/utils/db/user/setRoles"
// 引入 模型
const { Menu } = require("@/db/models")
const db = require("@/db/models")
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
    const { name, icon, to, layout, role, parentId } = req.body

    if (!name) return res.result(void 0, "创建菜单name是必须要有的哦~", false)

    if (!icon && !to && !layout && !role)
      return res.result(
        void 0,
        "创建菜单至少需要icon、to、layout、role其中的一个参数哦~",
        false
      )

    // 开启事务
    const transaction = await db.sequelize.transaction()
    try {
      const setData = {
        name,
        icon,
        to,
        layout,
        parentId,
      }

      // 创建菜单
      await Menu.create(setData, { transaction })

      // 得到 roles
      const roles = role?.length ? role : default_user
      // 处理 role
      const $roles = await setRoles(roles, next)
      // 设置 role
      await Menu.setRole($roles, { transaction })

      // 提交事务
      await transaction.commit()

      // 清除 菜单 的缓存
      await delRoles(roles)
      res.result(void 0, "创建菜单成功~")
    } catch (error) {
      await transaction.rollback() // 回滚事务
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建菜单失败~", false)
      )
    }
  }
)
export default router
