// 设置 redis 缓存
import { delKey } from "@/utils/redis"
// 清除 菜单 的缓存
export const delMenuRoles = async (roles: string[]) => {
  // 不管什么 权限 更新时都要去除
  delKey(`menu:*`)
  if (roles && roles.length) {
    // 清除 redis 缓存
    await Promise.all(roles.map((item: string) => delKey(`menu:${item}`)))
  }
}
