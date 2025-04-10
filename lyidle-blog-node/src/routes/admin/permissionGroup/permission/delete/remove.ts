// 引入redis
import { delKey } from "@/utils/redis"

// 引入模型
const { Permission } = require("@/db/models")

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async () => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissions:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 获取所有权限组 保存的键
  const cacheKeyGroup = `permissionGroup:*`
  // 删除 缓存
  await delKey(cacheKey)
  await delKey(cacheKeyRole)
  await delKey(cacheKeyGroup)
}

// 彻底删除函数
const deleted = async (model: any) => {
  // 删除权限子菜单
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove()
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: permissionId } = req.body

  if (!permissionId)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单", false)

  // 查找是否有权限子菜单
  const findPermission = await Permission.findByPk(permissionId, {
    paranoid: false,
  })

  // 没有找到权限子菜单
  if (!findPermission)
    return res.result(void 0, "删除权限子菜单时，没有找到权限子菜单", false)

  if (findPermission.name === "doc:publish")
    return res.result(
      void 0,
      `不能删除权限为: ${findPermission.name} 的权限`,
      false
    )
  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findPermission.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove()
    return res.result(void 0, "权限子菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findPermission)
  return res.result(void 0, "删除权限子菜单成功~")
}
export default remove
