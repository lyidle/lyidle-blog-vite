import { _handlerRoles } from "@/utils/db/handlerRoles"
import { delKeys } from ".."
import { deduplication } from "@/utils/array/deduplication"

// 环境变量
const default_owner = process.env.default_owner!

/**
 * 清除 Users 的信息 缓存
 * @param findUsers 查找到的user是一个数组
 * @param roles string[] 各式的 角色
 */
export const resetUserInfo = async (findUsers: string[], roles?: string[]) => {
  const users = JSON.parse(JSON.stringify(findUsers))
  // 是否包含owner
  let isOwnerRole: boolean = false
  // 需要删除 的数组 去重加 过滤
  const deleteArr = deduplication([
    users.map((item: any) => {
      // 找到 user中有owner的 改变 isOwnerRole true
      !isOwnerRole &&
        item.Roles.find((item: any) => {
          if (item.name === default_owner) {
            isOwnerRole = true
          }
        })
      return [item.id, item.account]
    }),
    roles,
    default_owner,
  ]).filter(Boolean)

  if (deleteArr && deleteArr.length) {
    // 删除 缓存
    await delKeys("userInfo:", deleteArr, (keys) => {
      let _keys = keys
      // 没有 找到 owner的则不需要删除 owner
      if (!isOwnerRole) {
        _keys = keys.filter((item) => item !== default_owner)
      }
      return _keys
    })
  }
}
