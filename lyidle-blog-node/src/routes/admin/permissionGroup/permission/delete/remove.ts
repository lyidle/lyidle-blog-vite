// 引入redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"

// 引入模型
const { PermissionGroup, Permission, Role, User } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (users: any[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissions:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 获取所有权限组 保存的键
  const cacheKeyGroup = `permissionGroup:*`
  // 删除 缓存
  await delKey(cacheKey)
  await delKey(cacheKeyRole)
  await delKey(cacheKeyGroup)
  // 删除找到的users的缓存
  await resetUserInfo(users)
}

// 彻底删除函数
const deleted = async (model: any, users: any[]) => {
  // 删除权限子菜单
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove(users)
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
        through: { attributes: [] },
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] },
            include: [
              {
                model: User,
                paranoid: false,
                attributes: ["id", "account"],
                through: { attributes: [] },
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

  // 没有找到权限子菜单
  if (!findPermission)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单", false)

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findPermission.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove(users)
    return res.result(void 0, "权限子菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findPermission, users)
  return res.result(void 0, "删除权限子菜单成功~")
}
export default remove
