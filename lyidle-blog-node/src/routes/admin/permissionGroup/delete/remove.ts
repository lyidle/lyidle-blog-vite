// 引入redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"

// 引入模型
const { PermissionGroup, Role, User, Menu } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (users: any[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 删除 缓存
  await delKey(cacheKey)
  await delKey(cacheKeyRole)
  // 删除找到的users的缓存
  await resetUserInfo(users)
}

// 彻底删除函数
const deleted = async (model: any, users: any[]) => {
  // 删除权限菜单
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove(users)
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
            through: { attributes: [] },
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

  // 处理找到的users
  const users = deduplication(
    JSON.parse(JSON.stringify(findGroup)).Roles?.map((item: any) => item.Users)
  ).filter(Boolean)

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findGroup.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove(users)
    return res.result(void 0, "权限菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findGroup, users)
  return res.result(void 0, "删除权限菜单成功~")
}
export default remove
