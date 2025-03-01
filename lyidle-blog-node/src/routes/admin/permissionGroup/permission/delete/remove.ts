// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除菜单缓存的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入时间转换
const ms = require("ms")

// 软删除权限子菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { PermissionGroup, Permission, Role, User } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (users: any[], roles: string[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissions:*`
  // 删除 缓存
  await delKey(cacheKey)
  // 删除找到的users的缓存
  await resetUserInfo(users)
  // 删除找到的roles的缓存
  await delMenuRoles(roles)
}

// 彻底删除函数
const deleted = async (
  model: any,
  id: number,
  users: any[],
  roles: string[]
) => {
  // 删除权限子菜单
  await model.destroy({ force: true })
  // 删除临时的 permissionsBin
  await delKey(`permissionsBin:${id}`)
  // 不管是否删除都要移除的
  await publicUserRemove(users, roles)
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: permissionId } = req.body

  if (!permissionId)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单", false)

  // 查找是否有权限子菜单
  // 逐级查询到缓存 的 Users
  const findPermission = await Permission.findByPk(permissionId, {
    paranoid: false,
    include: [
      {
        model: PermissionGroup,
        paranoid: false,
        attributes: ["id"],
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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
      },
    ],
  })

  // 处理找到的users
  const users = deduplication(
    JSON.parse(JSON.stringify(findPermission)).PermissionGroups?.map(
      (item: any) => item.Roles.map((item: any) => item.Users)
    )
  )
  // 处理找到的roles
  const roles = deduplication(users.map((item: any) => item.Roles)).filter(
    Boolean
  )

  // 没有找到权限子菜单
  if (!findPermission)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单", false)

  // 找到提取需要的信息
  const { id } = findPermission.dataValues

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`permissionsBin:${id}`)
    if (isBin)
      return res.result(
        void 0,
        "权限子菜单移动到垃圾桶了，请勿重复操作~",
        false
      )

    // 软删除
    await findPermission.destroy()
    // 设置缓存
    await setKey(`permissionsBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(users, roles)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "权限子菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findPermission, id, users, roles)
  return res.result(void 0, "删除权限子菜单成功~")
}
export default remove
