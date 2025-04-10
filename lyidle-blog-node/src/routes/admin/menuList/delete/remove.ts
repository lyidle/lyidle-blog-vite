// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 获取 roles 的函数
import { ReturnRoles } from "@/utils/db/handlerRoles"
// 去重的 函数
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除菜单的时间
const delete_menu_expire = ms(process.env.delete_menu_expire)
// 引入模型
const { Menu, Role, sequelize } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicMenusRemove = async (roles: string[]) => {
  // 清除 菜单 的缓存
  await delMenuRoles(roles)
}

// 彻底删除函数
const deleted = async (delMenu: any, roles: string[]) => {
  // 删除菜单
  await delMenu.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicMenusRemove(roles)
}
// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: menuId } = req.body

  if (!menuId) return res.result(void 0, "删除菜单时，没有找到菜单", false)

  // 查找是否有菜单
  const findMenu = await Menu.findByPk(menuId, {
    paranoid: false,
    include: [
      {
        model: Role,
        paranoid: false,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
      },
    ],
  })
  // 没有找到菜单
  if (!findMenu) return res.result(void 0, "删除菜单时，没有找到菜单", false)

  // 得到 roles
  let roles = deduplication(ReturnRoles([findMenu]))

  // 回收到垃圾桶
  if (bin) {
    // 开启事务
    const transaction = await sequelize.transaction()
    try {
      // 查询当前菜单的 parentId
      const parentId = JSON.parse(JSON.stringify(findMenu)).id

      // 软删除当前菜单
      await findMenu.destroy({ transaction })

      // 递归加载所有子菜单（包括嵌套的子菜单）
      const loadNestedMenus = async (parentId: number) => {
        const menus = await Menu.findAll({
          where: { parentId },
          include: [
            {
              model: Menu,
              as: "children", // 假设关联关系是 "children"
            },
            {
              model: Role,
              paranoid: false,
              attributes: ["name"], // 只获取角色名称
              through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            },
          ],
          transaction, // 将事务传递给查询
        })

        // 添加 roles
        roles.push(deduplication(ReturnRoles([menus])))

        // 递归加载子菜单的子菜单
        for (const menu of menus) {
          if (menu.children && menu.children.length > 0) {
            menu.children = await loadNestedMenus(menu.id)
          }
        }

        return menus
      }

      // 加载所有子菜单
      const nestedMenus = await loadNestedMenus(parentId)

      // 提取所有需要删除的菜单项（包括嵌套的子菜单）
      const menusToDelete: any[] = []
      const extractMenus = (menu: any) => {
        menusToDelete.push(menu) // 将当前菜单项加入删除列表
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach((child: any) => extractMenus(child)) // 递归提取子菜单
        }
      }

      nestedMenus.forEach((menu: any) => extractMenus(menu))

      // 并发删除所有菜单项
      await Promise.all(
        menusToDelete.map(async (item) => {
          await item.destroy({ transaction })
        })
      )

      // 去重
      roles = deduplication(roles).filter(Boolean)
      // 清理公共菜单缓存
      await publicMenusRemove(roles)

      // 提交事务
      await transaction.commit()

      // 返回成功响应
      return res.result(delete_menu_expire, "菜单成功移到回收站~", true)
    } catch (error) {
      // 发生错误时回滚
      await transaction.rollback()
      console.error("菜单移到回收站失败:", error) // 记录错误日志
      return res.result(void 0, "菜单移到回收站失败~", false)
    }
  }

  // 彻底删除
  await deleted(findMenu, roles)
  return res.result(void 0, "删除菜单成功~")
}
export default remove
