// 引入redis
import { delKey } from "@/utils/redis"

// 引入模型
const { PermissionGroup } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async () => {
  // 获取全部时保存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 删除 缓存
  await delKey(cacheKey)
  await delKey(cacheKeyRole)
}

// 彻底删除函数
const deleted = async (model: any) => {
  // 删除权限菜单
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove()
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: groupId } = req.body

  if (!groupId)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单", false)

  // 查找是否有权限组菜单
  const findGroup = await PermissionGroup.findByPk(groupId, {
    paranoid: false,
  })
  // 没有找到权限组菜单
  if (!findGroup)
    return res.result(void 0, "删除权限菜单时，没有找到权限菜单", false)

  // 得到 name
  const name = findGroup.dataValues?.name
  // 限制指定的name 不能修改
  if (name === default_owner || name === default_admin || name === default_user)
    return res.result(void 0, `不可删除名字为${name}的权限组`, false)

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findGroup.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove()
    return res.result(void 0, "权限菜单成功移到回收站~")
  }

  // 彻底删除
  await deleted(findGroup)
  return res.result(void 0, "删除权限菜单成功~")
}
export default remove
