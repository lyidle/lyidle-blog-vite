import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
import { delKey } from "@/utils/redis"
// 引入 模型
const { PermissionGroup, Role } = require("@/db/models")

const router = express.Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取所有角色 保存的键
    const cacheKey = "roles:*"

    // 得到id
    const { id, groups } = req.body

    if (!id || !groups?.length)
      return res.result(void 0, "设置角色权限组时,id和groups是必传项", false)

    // 查询对应id的信息
    const findRole = await Role.findByPk(id, {
      paranoid: false,
    })

    // 不存在
    if (!findRole)
      return res.result(void 0, "设置角色权限组时,获取角色失败~", false)

    const findGroups = await PermissionGroup.findAll({
      where: { name: groups },
    })

    if (!findGroups?.length) {
      return res.result(void 0, "设置角色权限组时,获取权限组失败~", false)
    }
    // 设置角色的权限组信息
    await findRole.setPermissionGroups(findGroups)

    // 返回并 删除缓存
    await delKey(cacheKey)
    return res.result(void 0, "获取角色权限组成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "设置角色权限组时失败~", false)
    )
  }
})
export default router
