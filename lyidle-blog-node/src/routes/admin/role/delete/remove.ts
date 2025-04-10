// 引入redis
import { delKey } from "@/utils/redis"
// 重置 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除角色的时间
const delete_menu_expire = ms(process.env.delete_menu_expire)
// 引入模型
const { Role, User } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

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
  // 不管是否删除都要移除的
  await publicUserRemove(roles, users)
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: roleId } = req.body

  if (!roleId) return res.result(void 0, "删除角色时，没有找到角色", false)

  // 查找是否有角色
  // 逐级查询到缓存 的 Users
  const findRole = await Role.findByPk(roleId, {
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
            attributes: ["name"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          },
        ],
      },
    ],
  })
  // 没有找到角色
  if (!findRole) return res.result(void 0, "删除角色时，没有找到角色", false)
  // 得到 name
  const name = findRole.name
  // 限制指定的name 不能修改
  if (name === default_owner || name === default_admin || name === default_user)
    return res.result(void 0, `不可删除名字为${name}的角色`, false)

  // 找到提取需要的信息
  const { id } = findRole.dataValues

  const _Role = JSON.parse(JSON.stringify(findRole))

  // 处理得到 users
  const users = deduplication(_Role.Users).filter(Boolean)
  // 处理找到的roles
  const roles = deduplication(
    _Role.Users?.map((item: any) => item.Roles?.map((item: any) => item.name))
  ).filter(Boolean)

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findRole.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove(roles, users)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu_expire, "角色成功移到回收站~")
  }

  // 彻底删除
  await deleted(findRole, id, roles, users)
  return res.result(void 0, "删除角色成功~")
}
export default remove
