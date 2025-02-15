import myError from "@/utils/error/myError"
import { delKeys, delKey } from "@/utils/redis"

// 清除菜单缓存
export const delMenuRoles = async (roles: string[]) => {
  await delKey("menu:*")
  if (roles && roles.length) {
    await delKeys("menu:", roles)
  }
}

/**
 * 保存菜单缓存 进行 简单的排序 避免顺序 问题保存多次
 * @param role 需要进行保存 role 是string[] 格式 或者 字符串 *
 * @return void
 */
export const saveMenuCache = (role: string[] | string) => {
  // 获取 权限菜单 的key
  if (role === "*") return `menu:*`
  // 不在 预期之类 报错
  if (typeof role === "string") {
    throw new myError("otherError", `缓存menu时出错,保存的键是预期之外的键哦~`)
  }
  // 对 role 进行排序（如果是多个角色，用逗号分隔）
  const sortedRoles = role.sort().join(",")
  const cacheKey = `menu:${sortedRoles}`
  return cacheKey
}
