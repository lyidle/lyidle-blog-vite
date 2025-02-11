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

    // 为用户添加角色
    // 遍历 roles 数组，查找或创建角色，并关联用户和角色
    if (roles && Array.isArray(roles)) {
      for (const roleName of roles) {
        const [role] = await Role.findOrCreate({
          where: { name: roleName },
          defaults: { name: roleName },
        })
        await user.addRole(role) // 关联用户和角色
      }
    }

    return user
  } catch (error) {
    // 角色创建错误 删除用户
    await user?.destroy()
    console.error("创建用户时出错:", error)
    throw error
  }
}
