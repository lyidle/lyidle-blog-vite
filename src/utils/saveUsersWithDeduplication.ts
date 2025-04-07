import { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
import { getPersistedData, setPersistedData } from "./crypto/crypto-aes"

type userType = GetFollowUser["data"]["users"]
// 用户数据去重保存函数
/**
 * 保存用户数据到本地缓存（自动去重）
 * @param newUsers 新获取的用户数组
 * @param cacheKey 缓存键名，默认为'atUserSearchs'
 */
export const saveUsersWithDeduplication = (
  newUsers: userType,
  cacheKey: string = "atUserSearchs"
): void => {
  if (!Array.isArray(newUsers) || newUsers.length === 0) return

  // 获取本地已有用户数据
  const localUsers = getPersistedData(cacheKey)
  const existingUsers = Array.isArray(localUsers) ? localUsers : []

  // 使用Map实现高效去重（基于用户ID）
  const userMap = new Map<number, userType[0]>()

  // 先添加已有用户
  existingUsers.forEach((user) => {
    if (user?.id) {
      userMap.set(user.id, user)
    }
  })

  // 添加新用户（重复ID会自动覆盖）
  newUsers.forEach((user) => {
    if (user?.id) {
      userMap.set(user.id, user)
    }
  })

  // 将Map转换回数组并保存
  const uniqueUsers = Array.from(userMap.values())
  // 设置1小时过期时间
  setPersistedData(cacheKey, uniqueUsers, 60 * 60 * 1000)
}
