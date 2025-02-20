import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除菜单缓存的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { PermissionGroup, Role, User } = require("@/db/models")

const router = express.Router()

// 更新 权限菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 删除缓存 redis 的键
    let cacheKey = `permissionGroup:*`
    const { id, name, desc } = req.body

    // 没有 id、name 返回失败
    if (!id) return res.result(void 0, "id是必传项哦~", false)

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findPermissionGroup = await PermissionGroup.findByPk(id)

      if (!findPermissionGroup)
        return res.result(void 0, "没有找到需要更新的权限菜单哦~", false)

      // 找到 了 则更新
      name && findPermissionGroup.set("name", name)
      findPermissionGroup.set("desc", desc ? desc : null)

      const result = await findPermissionGroup.save()
      const groupId = JSON.parse(JSON.stringify(result)).id

      // 逐级查询到缓存 的 Users
      const findGroup = await PermissionGroup.findByPk(groupId, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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
          },
        ],
      })

      // 处理找到的users
      const users = deduplication(
        JSON.parse(JSON.stringify(findGroup)).Roles?.map(
          (item: any) => item.Users
        )
      ).filter(Boolean)

      // 处理找到的roles
      const roles = deduplication(
        users.map((item) => item.Roles?.map((item: any) => item.name))
      ).filter(Boolean) as string[]

      // 删除找到的users的缓存
      await resetUserInfo(users)
      // 删除找到的menus的缓存
      await delMenuRoles({ roles })

      // 删除缓存
      await delKey(cacheKey)

      res.result(void 0, "更新权限菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新权限菜单失败~", false)
      )
    }
  }
)
export default router
