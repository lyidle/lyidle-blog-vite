import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 处理role
import { setRoles } from "@/utils/db/user/setRoles"
// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
import { _handlerRoles } from "@/utils/db/handlerRoles"
import { deduplication } from "@/utils/array/deduplication"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { Menu, Role } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()

// 用户角色用户组
const default_user = process.env.default_user!
// 更新 菜单
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, icon, to, layout, roles, parentId } = req.body
  // 没有 id、name 返回失败
  if (!id) return res.result(void 0, "id是必传项", false)

  // 开启事务
  const transaction = await db.sequelize.transaction()

  try {
    // 存储查询到的结果

    // 通过id 查找
    let findMenu = await Menu.findByPk(id, {
      include: [
        {
          model: Role,
          paranoid: false,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })

    if (!findMenu) {
      await transaction.rollback() // 回滚事务
      return res.result(void 0, "没有找到需要更新的菜单", false)
    }

    const menu = JSON.parse(JSON.stringify(findMenu))

    // 处理原来的 roles
    let originRoles: string[] | null = null
    if (menu.Roles) {
      originRoles = _handlerRoles(menu.Roles)
    }

    // 找到 了 则更新
    name && findMenu.set("name", name)
    findMenu.set("icon", icon || null)
    findMenu.set("to", to || null)
    findMenu.set("layout", layout || null)
    findMenu.set("parentId", parentId || null)

    // 验证 修改了的 属性字段
    await validateChangedFields(findMenu)

    await findMenu.save({ transaction })

    // 得到 roles
    const _roles = roles?.length ? roles : [default_user]

    // 处理 roles
    const $roles = await setRoles(_roles)

    if ($roles?.length) {
      // 设置 roles
      await findMenu.setRoles($roles, { transaction })

      // 处理 roles 的缓存
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
})
export default router
