import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 清除 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 清除菜单缓存 的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { Role, User } = require("@/db/models")

const router = express.Router()

// 更新 角色
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取所有角色 保存的键
    const cacheKey = "roles:*"
    const { id, name, desc } = req.body
    // 没有 id、name 返回失败
    if (!id) return res.result(void 0, "id是必传项哦~", false)

    try {
      // 通过id 查找
      let findRole = await Role.findByPk(id, {
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

      if (!findRole)
        return res.result(void 0, "没有找到需要更新的角色哦~", false)

      // 找到 了 则更新
      name && findRole.set("name", name)
      findRole.set("desc", desc ? desc : null)

      await findRole.save()

      const _Role = JSON.parse(JSON.stringify(findRole))
      // 处理找到的users
      const users = deduplication(_Role.Users).filter(Boolean)
      // 处理找到的roles
      const roles = deduplication(
        _Role.Users?.map((item: any) =>
          item.Roles?.map((item: any) => item.name)
        )
      ).filter(Boolean)

      // 删除 找到 的Menu用到的缓存
      await delMenuRoles(roles)
      // 删除找到的users的缓存
      await resetUserInfo(users)

      // 删除缓存
      await delKey(cacheKey)
      res.result(void 0, "更新角色成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新角色失败~", false)
      )
    }
  }
)
export default router
