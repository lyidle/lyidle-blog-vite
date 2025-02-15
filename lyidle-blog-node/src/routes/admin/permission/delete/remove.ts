// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 获取 role 的函数
import { ReturnRoles } from "@/utils/db/handlerRoles"
// 去重的 函数
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { Menu, Role } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (role: string[]) => {
  // 清除 菜单 的缓存
  await delMenuRoles(role)
}

// 彻底删除函数
const deleted = async (delMenu: any, id: number, role: string[]) => {
  // 删除菜单
  await delMenu.destroy({ force: true })
  // 删除临时的 userMenusBin
  await delKey(`userMenusBin:${id}`)
  // 不管是否删除都要移除的
  await publicUserRemove(role)
}
// 删除函数
const remove = async (
  req: any,
  res: any,
  bin: boolean = false,
  isAuth = true
) => {
  const { id: menuId } = req.body

  if (!menuId) return res.result(void 0, "删除菜单时，没有找到菜单哦~", false)

  // 查找是否有菜单
  const findMenu = await Menu.findByPk(menuId, { paranoid: false })
  // 没有找到菜单
  if (!findMenu) return res.result(void 0, "删除菜单时，没有找到菜单哦~", false)

  // 找到提取需要的信息
  const { id } = findMenu.dataValues

  //  查询 文章 的角色 清除 menuList 的缓存
  const existingRoles = await Menu.findAll({
    include: [
      {
        model: Role,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
      },
    ],
    where: { id },
    paranoid: false,
  })

  // 得到 roles
  const roles = deduplication(ReturnRoles(existingRoles))

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的菜单
    if (
      !req.auth.role.find((item: string) =>
        roles.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的菜单哦~", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userMenusBin:${id}`)
    if (isBin)
      return res.result(void 0, "菜单移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findMenu.destroy()
    // 设置缓存
    await setKey(`userMenusBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(roles)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findMenu, id, roles)
  return res.result(void 0, "删除菜单成功~")
}
export default remove
