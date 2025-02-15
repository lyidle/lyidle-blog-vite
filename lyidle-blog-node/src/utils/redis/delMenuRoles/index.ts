import myError from "@/utils/error/myError"
import { delKeys, delKey, genCacheKey } from "@/utils/redis"

// 清除菜单缓存
export const delMenuRoles = async (roles: string[]) => {
  // 获取所有菜单的缓存 无论如何都要删除
  await delKey("menu:*")
  if (roles && roles.length) {
    await delKeys("menu:", roles)
  }
}

/**
 * 保存菜单缓存 进行 简单的排序 避免顺序 问题保存多次
 * @param roles 需要进行保存 roles 是string[] 格式 或者 字符串 *
 * @return void
 */
export const saveMenuCache = (roles: string[] | string) => {
  // 获取 权限菜单 的key
  if (roles === "*") return `menu:*`
  // 不在 预期之类 报错
  if (typeof roles === "string") {
    throw new myError("otherError", `缓存menu时出错,保存的键是预期之外的键哦~`)
  }
  return genCacheKey("menu:", roles)
}
