const { User, Role } = require("@/db/models")

export const createUserWithRoles = async (userData: any, roles: string[]) => {
  // 存储 创建 的 用户
  let user: any
  try {
    // 创建用户
    user = await User.create(userData)

    // 确保用户和角色都存在
    if (!user) {
      throw new Error("用户不存在")
    }

    if (roles && Array.isArray(roles)) {
      // 批量查找或创建角色
      const roleInstances = await Promise.all(
        roles.map(async (roleName) => {
          const [role] = await Role.findOrCreate({
            where: { name: roleName },
            defaults: { name: roleName },
          })
          return role
        })
      )

      // 直接重置用户角色
      await user.setRoles(roleInstances)
    }

    return user
  } catch (error) {
    // 角色创建错误 删除用户
    await user?.destroy()
    console.error("创建用户时出错:", error)
    throw error
  }
}
