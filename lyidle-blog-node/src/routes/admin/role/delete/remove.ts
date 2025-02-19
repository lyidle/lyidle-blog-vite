// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 重置 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除角色的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { Role, User } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (roles: string[], users: any[]) => {
  // 获取所有角色 保存的键
  const cacheKey = "roles:*"
  // 删除 缓存
  await delKey(cacheKey)
  // 重置 用户的信息缓存
  await resetUserInfo(users)
  // 清除 菜单 的缓存
  await delMenuRoles(roles)
}

// 彻底删除函数
const deleted = async (
  model: any,
  id: number,
  roles: string[],
  users: any[]
) => {
  // 删除角色
  await model.destroy({ force: true })
  // 删除临时的 roleBin
  await delKey(`roleBin:${id}`)
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
  const { id: roleId } = req.body

  if (!roleId) return res.result(void 0, "删除角色时，没有找到角色哦~", false)

  // 查找是否有角色
  // 逐级查询到缓存 的 Users
  const findRole = await Role.findByPk(roleId, {
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
  })
  // 没有找到角色
  if (!findRole) return res.result(void 0, "删除角色时，没有找到角色哦~", false)

  // 找到提取需要的信息
  const { id } = findRole.dataValues

  const _roles = JSON.parse(JSON.stringify(findRole))

  // 处理得到 users
  const users = deduplication(_roles.Users)
  // 处理得到 roles
  const roles = deduplication(_roles.name)

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的角色
    if (
      !req.auth.roles.find((item: string) =>
        roles.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的角色哦~", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`roleBin:${id}`)
    if (isBin)
      return res.result(void 0, "角色移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findRole.destroy()
    // 设置缓存
    await setKey(`roleBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(roles, users)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "角色成功移到回收站~")
  }

  // 彻底删除
  await deleted(findRole, id, roles, users)
  return res.result(void 0, "删除角色成功~")
}
export default remove
