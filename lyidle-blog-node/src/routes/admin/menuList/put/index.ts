import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 处理role
import { setRoles } from "@/utils/db/user/setRoles"
// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
import { _handlerRoles } from "@/utils/db/handlerRoles"
import { deduplication } from "@/utils/array/deduplication"
// 引入 模型
const { Menu, Role } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()

// 用户角色用户组
const default_user = JSON.parse(process.env.default_user!)
// 更新 菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, icon, to, layout, bannerImg, roles, parentId } = req.body
    // 没有 id、name 返回失败
    if (!id) return res.result(void 0, "id是必传项哦~", false)

    // 开启事务
    const transaction = await db.sequelize.transaction()

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findMenu = await Menu.findByPk(id, {
        include: [
          {
            model: Role,
            attributes: ["name"], // 只获取角色名称
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          },
        ],
      })

      if (!findMenu) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到需要更新的菜单哦~", false)
      }

      const menu = JSON.parse(JSON.stringify(findMenu))
      let originRoles: string[] | null = null
      if (menu.Roles) {
        originRoles = _handlerRoles(menu.Roles)
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
      const _roles = roles?.length ? roles : default_user

      // 处理 roles
      const $roles = await setRoles(_roles)

      if ($roles?.length) {
        // 设置 roles
        await findMenu.setRoles($roles, { transaction })
        // 保存 需要删除 roles
        let roles = _roles
        // 判断 有无 原来的 角色信息
        if (originRoles?.length) {
          roles = deduplication([originRoles, roles]) as string[]
        }
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
