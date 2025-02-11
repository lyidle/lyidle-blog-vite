// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 清除 菜单 的缓存
import { delRoles } from "../set"
// 引入时间转换
const ms = require("ms")

// 软删除菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { Menu } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (role: string[]) => {
  // 清除 菜单 的缓存
  await delRoles(role)
}

// 彻底删除函数
const deleted = async (delMenu: any, id: number, role: string[]) => {
  // 删除菜单
  await delMenu.destroy()
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
  const findMenu = await Menu.findByPk(menuId)
  // 没有找到菜单
  if (!findMenu) return res.result(void 0, "删除菜单时，没有找到菜单哦~", false)

  // 找到提取需要的信息
  const { id, role } = findMenu.dataValues

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的菜单
    if (
      !req.auth.role.find((item: string) =>
        role.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的菜单哦~", false)
    }
  }

  // 不管是否删除都要移除的
  await publicUserRemove(role)

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userMenusBin:${id}`)
    if (isBin)
      return res.result(void 0, "菜单移动到垃圾桶了，请勿重复操作~", false)

    // 设置数据
    findMenu.set("isBin", Date.now() + delete_menu)
    // 更新
    await findMenu.save()
    // 设置缓存
    await setKey(`userMenusBin:${id}`, true)

    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findMenu, id, role)
  return res.result(void 0, "删除菜单成功~")
}
export default remove
