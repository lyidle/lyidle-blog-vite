import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// redis
import { delKey } from "@/utils/redis"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { Role } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

const router = express.Router()

// 更新 角色
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  // 获取所有角色 保存的键
  const cacheKey = "roles:*"
  const { id, name, desc } = req.body
  // 没有 id、name 返回失败
  if (!id) return res.result(void 0, "id是必传项", false)

  try {
    // 通过id 查找
    let findRole = await Role.findByPk(id, {
      paranoid: false,
    })

    if (!findRole) return res.result(void 0, "没有找到需要更新的角色", false)

    // 得到 name
    const _name = findRole.name
    // 限制指定的name 不能修改
    if (
      _name !== name &&
      (_name === default_owner ||
        _name === default_admin ||
        _name === default_user)
    )
      return res.result(
        _name,
        `更新角色失败,不能修改角色为${_name}的名字`,
        false
      )

    findRole.set("name", name)
    findRole.set("desc", desc || null)

    // 验证 修改了的 属性字段
    await validateChangedFields(findRole)

    await findRole.save()

    // 删除缓存
    await delKey(cacheKey)

    res.result(void 0, "更新角色成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新角色失败~", false)
    )
  }
})
export default router
