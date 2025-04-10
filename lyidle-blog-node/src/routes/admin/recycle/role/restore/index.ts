import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
import { deduplication } from "@/utils/array/deduplication"
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
          through: { attributes: [] },
          include: [
            {
              model: Role,
              paranoid: false,
              attributes: ["name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    })

    if (!findRole)
      return res.result(void 0, "恢复角色失败,没有找到角色数据", false)

    // 恢复 角色
    await findRole.restore()
    const _Role = JSON.parse(JSON.stringify(findRole))
    // 处理找到的users
    const users = deduplication(_Role.Users).filter(Boolean)

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
