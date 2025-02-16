// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入 获取 roles 的函数
import { ReturnRoles } from "@/utils/db/handlerRoles"
// 重置 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除权限菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { PermissionGroup, Role, User } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (roles: string[], users: any[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 删除 缓存
  await delKey(cacheKey)
  // 重置 用户的信息缓存
  await resetUserInfo(users)
}

// 彻底删除函数
const deleted = async (
  model: any,
  id: number,
  roles: string[],
  users: any[]
) => {
  // 删除权限菜单
  await model.destroy({ force: true })
  // 删除临时的 permissionGroupBin
  await delKey(`permissionGroupBin:${id}`)
  // 不管是否删除都要移除的
  await publicUserRemove(roles, users)
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
  // 逐级查询到缓存 的 Users
  const findGroup = await PermissionGroup.findByPk(groupId, {
    paranoid: false,
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        paranoid: false,
        include: [
          {
            model: User,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            include: [
              {
                model: Role,
                paranoid: false,
                attributes: ["id", "name"], // 只获取角色名称
                through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                required: true, //按照 role时 过滤 User 的数据
              },
            ],
          },
        ],
      },
    ],
  })
  // 没有找到权限菜单
  if (!findGroup)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单哦~", false)

  // 找到提取需要的信息
  const { id } = findGroup.dataValues

  const groups = JSON.parse(JSON.stringify(findGroup))
  // 处理得到 users
  const users = deduplication(groups.Roles?.map((item: any) => item.Users))
  // 处理得到 roles
  const roles = deduplication(groups.Roles?.map((item: any) => item.name))

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的权限菜单
    if (
      !req.auth.roles.find((item: string) =>
        roles.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的权限菜单哦~", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`permissionGroupBin:${id}`)
    if (isBin)
      return res.result(void 0, "权限菜单移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findGroup.destroy()
    // 设置缓存
    await setKey(`permissionGroupBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(roles, users)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "权限菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findGroup, id, roles, users)
  return res.result(void 0, "删除权限菜单成功~")
}
export default remove
