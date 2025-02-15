// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 重置 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { deduplication } from "@/utils/array/deduplication"
// 引入时间转换
const ms = require("ms")

// 软删除权限子菜单的时间
const delete_menu = ms(process.env.delete_menu)
// 引入模型
const { PermissionGroup, Permission, Role, User } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (roles: string[], users: any[]) => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissions:*`
  // 删除 缓存
  await delKey(cacheKey)
  // 重置 用户的信息缓存
  await resetUserInfo(users)
}

// 彻底删除函数
const deleted = async (
  model: any,
  id: number,
  role: string[],
  users: any[]
) => {
  // 删除权限子菜单
  await model.destroy({ force: true })
  // 删除临时的 permissionsBin
  await delKey(`permissionsBin:${id}`)
  // 不管是否删除都要移除的
  await publicUserRemove(role, users)
}

// 删除函数
const remove = async (
  req: any,
  res: any,
  bin: boolean = false,
  isAuth = true
) => {
  const { id: permissionId } = req.body

  if (!permissionId)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单哦~", false)

  // 查找是否有权限子菜单
  const findPermission = await Permission.findByPk(permissionId, {
    paranoid: false,
    include: [
      {
        // 得到 父级 的Roles
        model: PermissionGroup,
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
          },
        ],
      },
    ],
  })

  // 去除联系
  const permissions = JSON.parse(JSON.stringify(findPermission))

  // 没有找到权限子菜单
  if (!findPermission)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单哦~", false)

  // 找到提取需要的信息
  const { id } = findPermission.dataValues

  // 得到 roles
  const roles = deduplication(
    permissions.PermissionGroups.map((item: any) =>
      item.Roles.map((item: any) => item.name)
    )
  ).filter(Boolean)

  const users = await User.findAll({
    paranoid: false,
    attributes: ["id"], // 只获取角色名称
    include: [
      {
        model: Role,
        paranoid: false,
        attributes: ["id", "name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        where: { name: roles }, // 传入 role 时查询对于的 role 没有时 查询全部
        required: true, //按照 role时 过滤 User 的数据
      },
    ],
  })

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是该用户权限的权限子菜单
    if (
      !req.auth.roles.find((item: string) =>
        roles.find(($item: string) => item.includes($item))
      )
    ) {
      return res.result(void 0, "没有权限删除当前的权限子菜单哦~", false)
    }
  }

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
    await publicUserRemove(roles, users)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_menu, "权限子菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findPermission, id, roles, users)
  return res.result(void 0, "删除权限子菜单成功~")
}
export default remove
