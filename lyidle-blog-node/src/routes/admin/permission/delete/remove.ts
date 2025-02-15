// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 清除 权限菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 获取 role 的函数
import { ReturnRoles } from "@/utils/db/handlerRoles"
// 去重的 函数
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除权限菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { PermissionGroup, Role } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (roles: string[]) => {
  // 保存 redis 的键
  let cacheKey = `permission:*`
  // 删除 缓存
  await delKey(cacheKey)
  await delMenuRoles(roles)
}

// 彻底删除函数
const deleted = async (model: any, id: number, role: string[]) => {
  // 删除权限菜单
  await model.destroy({ force: true })
  // 删除临时的 permissionsBin
  await delKey(`permissionsBin:${id}`)
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
  const { id: groupId } = req.body

  if (!groupId)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单哦~", false)

  // 查找是否有权限菜单
  const findGroup = await PermissionGroup.findByPk(groupId, { paranoid: false })
  // 没有找到权限菜单
  if (!findGroup)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单哦~", false)

  // 找到提取需要的信息
  const { id, name } = findGroup.dataValues

  // 得到 roles
  const roles = [name]
  console.log(roles)

  // 不管是否是软删除都要移除的
  await publicUserRemove(roles)
  throw new Error("")

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的权限菜单
    if (
      !req.auth.role.find((item: string) =>
        roles.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的权限菜单哦~", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`permissionsBin:${id}`)
    if (isBin)
      return res.result(void 0, "权限菜单移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findGroup.destroy()
    // 设置缓存
    await setKey(`permissionsBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(roles)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "权限菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findGroup, id, roles)
  return res.result(void 0, "删除权限菜单成功~")
}
export default remove
