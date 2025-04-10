import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { deduplication } from "@/utils/array/deduplication"
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { delKey } from "@/utils/redis"
// 引入 模型
const { Role, User } = require("@/db/models")
const router = express.Router()

// 恢复角色
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // 获取所有角色 保存的键
  const cacheKey = "roles:*"
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复角色失败,id是必传项", false)

  try {
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

    if (!findRole)
      return res.result(void 0, "恢复角色失败,没有找到角色数据", false)

    // 恢复 角色
    const newRole = await findRole.restore()
    const _Role = JSON.parse(JSON.stringify(newRole))
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

    // 删除缓存
    await delKey(cacheKey)

    res.result(void 0, "恢复角色成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复角色失败~", false)
    )
  }
})
export default router
