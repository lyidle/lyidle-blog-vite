import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入redis
import { delKey } from "@/utils/redis"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { Permission } = require("@/db/models")

const router = express.Router()

// 更新 权限菜单
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  // 保存 redis 的键
  let cacheKey = `permissions:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 获取所有权限组 保存的键
  const cacheKeyGroup = `permissionGroup:*`
  // 删除缓存 redis 的键
  const { id, name, desc } = req.body

  // 没有 id、name 返回失败
  if (!id) return res.result(void 0, "id是必传项", false)

  try {
    // 通过id 查找
    let findPermission = await Permission.findByPk(id, {
      paranoid: false,
    })

    if (!findPermission)
      return res.result(void 0, "没有找到需要更新的权限菜单", false)
    if (name !== "doc:publish" && findPermission.name === "doc:publish")
      return res.result(
        void 0,
        `不能修改权限为: ${findPermission.name} 的权限`,
        false
      )
    // 找到 了 则更新
    name && findPermission.set("name", name)
    findPermission.set("desc", desc || null)

    // 验证 修改了的 属性字段
    await validateChangedFields(findPermission)

    await findPermission.save()

    // 删除 缓存
    await delKey(cacheKey)
    await delKey(cacheKeyRole)
    await delKey(cacheKeyGroup)
    res.result(void 0, "更新权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新权限菜单失败~", false)
    )
  }
})
export default router
