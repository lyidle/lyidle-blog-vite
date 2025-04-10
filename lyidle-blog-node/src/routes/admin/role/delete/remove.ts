// 引入redis
import { delKey } from "@/utils/redis"

// 引入模型
const { Role } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async () => {
  // 获取所有角色 保存的键
  const cacheKey = "roles:*"
  // 删除 缓存
  await delKey(cacheKey)
}

// 彻底删除函数
const deleted = async (model: any) => {
  // 删除角色
  await model.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove()
}

// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id: roleId } = req.body

  if (!roleId) return res.result(void 0, "删除角色时，没有找到角色", false)

  // 查找是否有角色
  const findRole = await Role.findByPk(roleId, {
    paranoid: false,
  })
  // 没有找到角色
  if (!findRole) return res.result(void 0, "删除角色时，没有找到角色", false)
  // 得到 name
  const name = findRole.name
  // 限制指定的name 不能修改
  if (name === default_owner || name === default_admin || name === default_user)
    return res.result(void 0, `不可删除名字为${name}的角色`, false)

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findRole.destroy()

    // 不管是否是软删除都要移除的
    await publicUserRemove()
    return res.result(void 0, "角色成功移到回收站~")
  }

  // 彻底删除
  await deleted(findRole)
  return res.result(void 0, "删除角色成功~")
}
export default remove
