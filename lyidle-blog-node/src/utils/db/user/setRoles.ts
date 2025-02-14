// 引入 模型
const { Role } = require("@/db/models")
import { deduplication } from "@/utils/array/deduplication"
// 自定义错误
import myError from "@/utils/error/myError"

// 设置和创建权限 权限没有时才创建
export const setRoles = async (roles: string[]) => {
  if (!(roles && Array.isArray(roles))) {
    throw new myError(
      "otherError",
      "设置和创建角色时，roles必须要是一个数组哦~"
    )
  }
  // 去重 加过滤
  const _roles = deduplication(roles).filter(Boolean)

  if (!_roles?.length) {
    throw new myError("otherError", "设置和创建角色时，default_user未初始化~")
  }

  //  先查询数据库中已有的角色
  const existingRoles = await Role.findAll({
    where: { name: _roles },
  })

  // 找出数据库中没有的角色
  const existingRoleNames = JSON.parse(JSON.stringify(existingRoles))
    .map((role: any) => role?.name)
    .filter(Boolean)

  const newRoleNames = _roles.filter(
    (roleName) => !existingRoleNames.includes(roleName)
  )

  let newRoles

  if (newRoleNames?.length > 0) {
    //  批量创建新的角色
    newRoles = await Role.bulkCreate(
      newRoleNames.map((name) => ({ name })),
      { returning: true } // 返回创建的实例
    )
  }

  //  合并已有角色 + 新创建的角色
  let roleInstances = existingRoles
  if (newRoles?.length) roleInstances = [...existingRoles, ...newRoles]
  // 没有 长度
  if (!roleInstances?.length) {
    throw new myError("otherError", "设置和创建角色时，失败~")
  }

  return roleInstances
}
