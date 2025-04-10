import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// redis
import { delKey } from "@/utils/redis"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { PermissionGroup } = require("@/db/models")

const router = express.Router()

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

// 更新 权限菜单
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  // 删除缓存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  const { id, name, desc } = req.body

  // 没有 id、name 返回失败
  if (!id || !name) return res.result(void 0, "id、name是必传项", false)

  try {
    // 存储查询到的结果

    // 通过id 查找
    let findGroup = await PermissionGroup.findByPk(id, {
      paranoid: false,
    })

    if (!findGroup)
      return res.result(void 0, "没有找到需要更新的权限菜单", false)

    // 得到查询到的  name
    const _name = findGroup.dataValues?.name
    // 限制指定的name 不能修改
    if (
      name !== _name &&
      (_name === default_owner ||
        _name === default_admin ||
        _name === default_user)
    )
      return res.result(_name, `不可修改名字为${_name}的权限组`, false)

    // 找到 了 则更新
    findGroup.set("name", name)
    findGroup.set("desc", desc || null)

    // 验证 修改了的 属性字段
    await validateChangedFields(findGroup)

    await findGroup.save()

    // 删除缓存
    await delKey(cacheKey)
    await delKey(cacheKeyRole)

    res.result(void 0, "更新权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新权限菜单失败~", false)
    )
  }
})
export default router
