// 引入 模型
const { Role } = require("@/db/models")
// 设置和创建权限 权限没有时才创建
export const setRoles = async (roles: string[]) => {
  if (!(roles && Array.isArray(roles))) {
    throw new Error("设置和创建角色时，roles必须要是一个数组哦~")
  }
  //  先查询数据库中已有的角色
  const existingRoles = await Role.findAll({
    where: { name: roles },
  })

  // 找出数据库中没有的角色
  const existingRoleNames = existingRoles
    .map((role: any) => role.dataValues?.name)
    .filter(Boolean)

  const newRoleNames = roles.filter(
    (roleName) => !existingRoleNames.includes(roleName)
  )

  let newRoles = []

  if (newRoleNames.length > 0) {
    //  批量创建新的角色（避免一条条 `findOrCreate`）
    newRoles = await Role.bulkCreate(
      newRoleNames.map((name) => ({ name })),
      { returning: true } // 返回创建的实例
    )
  }

  //  合并已有角色 + 新创建的角色
  const roleInstances = [...existingRoles, ...newRoles]

  return roleInstances
}
