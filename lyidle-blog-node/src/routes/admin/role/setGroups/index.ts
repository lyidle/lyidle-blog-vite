import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
import { delKey } from "@/utils/redis"
// 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 清除 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 清除菜单缓存 的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { PermissionGroup, Role, User } = require("@/db/models")

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
      include: [
        {
          model: User,
          paranoid: false,
          attributes: ["id", "account"],
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          include: [
            {
              model: Role,
              paranoid: false,
              attributes: ["name"], // 只获取角色名称
              through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            },
          ],
        },
      ],
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

    const _Role = JSON.parse(JSON.stringify(findRole))
    // 处理找到的users
    const users = deduplication(_Role.Users).filter(Boolean)
    // 处理找到的roles
    const roles = deduplication(
      _Role.Users?.map((item: any) => item.Roles?.map((item: any) => item.name))
    ).filter(Boolean)

    // 删除 找到 的Menu用到的缓存
    await delMenuRoles(roles)
    // 删除找到的users的缓存
    await resetUserInfo(users)

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
