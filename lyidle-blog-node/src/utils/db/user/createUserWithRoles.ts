// 引入 类型
import type { NextFunction } from "express"
// 引入 设置和创建权限 权限没有时才创建
import { setRoles } from "./setRoles"

const { User } = require("@/db/models")

export const createUserWithRoles = async (
  userData: any,
  roles: string[],
  next: NextFunction
) => {
  // 存储 创建 的 用户
  let user: any
  try {
    // 创建用户
    user = await User.create(userData)

    // 确保用户和角色都存在
    if (!user) {
      throw new Error("创建用户时，用户创建后不存在哦~")
    }

    // 设置和创建权限
    const result = await setRoles(roles)
    if (result.length) {
      //  直接重置用户角色
      await user.setRoles(result)
    }

    return user
  } catch (error) {
    // 角色创建错误 删除用户
    await user?.destroy()
    console.error("创建用户时出错:", error)
    throw error
  }
}
