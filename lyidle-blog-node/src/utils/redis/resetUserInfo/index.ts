import { _handlerRoles } from "@/utils/db/handlerRoles"
import { delKeys } from ".."

// 清除 user的信息 缓存
export const resetUserInfo = async (findUsers: string[]) => {
  const users = JSON.parse(JSON.stringify(findUsers))
  let isOwnerRole: boolean = false
  const userIds = users.map((item: any) => {
    // 找到 user中有owner的 改变 isOwnerRole true
    item.Roles.find((item: any) => {
      if (item.name === "owner") {
        isOwnerRole = true
      }
    })
    return item.id
  })

  if (userIds && userIds.length) {
    // 删除 缓存
    await delKeys("userInfo:", userIds, (keys) => {
      let _keys = keys
      // 没有 找到 owner的则不需要删除 owner
      if (!isOwnerRole) {
        _keys = keys.filter((item) => item !== "owner")
      }
      console.log({ _keys })

      return _keys
    })
  }
}
