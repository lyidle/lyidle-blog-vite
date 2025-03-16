// 引入redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除菜单缓存的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入时间转换
const ms = require("ms")

// 软删除权限菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { PermissionGroup, Role, User } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (users: any[], roles: string[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 删除 缓存
  await delKey(cacheKey)
  await delKey(cacheKeyRole)
  // 删除找到的users的缓存
  await resetUserInfo(users)
  // 删除找到的menus的缓存
  await delMenuRoles(roles)
}

// 彻底删除函数
const deleted = async (
  model: any,
  id: number,
  users: any[],
  roles: string[]
) => {
  // 删除权限菜单
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove(users, roles)
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: groupId } = req.body

  if (!groupId)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单", false)

  // 查找是否有权限组菜单
  // 逐级查询到缓存 的 Users
  const findGroup = await PermissionGroup.findByPk(groupId, {
    paranoid: false,
    include: [
      {
        model: Role,
        attributes: ["id"],
        paranoid: false,
        include: [
          {
            model: User,
            paranoid: false,
            attributes: ["id", "account"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            include: [
              {
                model: Role,
                paranoid: false,
                attributes: ["name"], // 只获取角色名称
                through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
              },
            ],
          },
        ],
      },
    ],
  })
  // 没有找到权限组菜单
  if (!findGroup)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单", false)

  // 得到 name
  const name = findGroup.dataValues?.name
  // 限制指定的name 不能修改
  if (name === default_owner || name === default_admin)
    return res.result(void 0, `不可删除名字为${name}的权限组`, false)

  // 找到提取需要的信息
  const { id } = findGroup.dataValues

  // 处理找到的users
  const users = deduplication(
    JSON.parse(JSON.stringify(findGroup)).Roles?.map((item: any) => item.Users)
  ).filter(Boolean)

  // 处理找到的roles
  const roles = deduplication(
    users.map((item) => item.Roles?.map((item: any) => item.name))
  ).filter(Boolean) as string[]

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findGroup.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove(users, roles)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "权限菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findGroup, id, users, roles)
  return res.result(void 0, "删除权限菜单成功~")
}
export default remove
