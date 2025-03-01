import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 处理role
import { setRoles } from "@/utils/db/user/setRoles"
// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { Menu } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()
// 用户角色用户组
const default_user = process.env.default_user!
// 创建菜单
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, icon, to, layout, roles, parentId } = req.body

    if (!name) return res.result(void 0, "创建菜单name是必须要有的", false)

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
      const newMenu = await Menu.create(setData, { transaction })

      // 得到 roles
      const _roles = roles?.length ? roles : [default_user]
      // 处理 roles
      const $roles = await setRoles(_roles)

      if ($roles?.length) {
        // 设置 roles
        await newMenu.setRoles($roles, { transaction })
        // 清除 菜单 的缓存
        await delMenuRoles(_roles)
      }

      // 提交事务
      await transaction.commit()

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
