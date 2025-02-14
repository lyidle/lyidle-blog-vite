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
const default_user = JSON.parse(process.env.default_user!)
// 更新 菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, icon, to, layout, bannerImg, role, parentId } = req.body

    // 没有 id、name 返回失败
    if (id !== 0 && !id) return res.result(void 0, "id是必传项哦~", false)

    // 开启事务
    const transaction = await db.sequelize.transaction()

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findMenu = await Menu.findByPk(id)

      if (!findMenu) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到需要更新的菜单哦~", false)
      }

      // 找到 了 则更新
      name && findMenu.set("name", name)
      icon && findMenu.set("icon", icon)
      to && findMenu.set("to", to)
      layout && findMenu.set("layout", layout)
      bannerImg && findMenu.set("bannerImg", bannerImg)
      parentId && findMenu.set("parentId", parentId)

      await findMenu.save({ transaction })

      // 得到 roles
      const roles = role?.length ? role : default_user
      // 处理 role
      const $roles = await setRoles(roles)

      if ($roles?.length) {
        // 设置 role
        await findMenu.setRoles($roles, { transaction })
        // 清除 菜单 的缓存
        await delMenuRoles(roles)
      }

      // 提交事务
      await transaction.commit()

      res.result(void 0, "更新菜单成功~")
    } catch (error) {
      await transaction.rollback() // 回滚事务
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新菜单失败~", false)
      )
    }
  }
)
export default router
