import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 模型
const { User, Role } = require("@/db/models")
const router = express.Router()

// 恢复用户
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复用户失败,id是必传项", false)

  try {
    const findUser = await User.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Role,
          paranoid: false,
          attributes: ["name"], // 只获取角色名称
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        },
      ],
    })

    if (!findUser)
      return res.result(void 0, "恢复用户失败,没有找到用户数据", false)

    // 恢复 用户
    const newUser = await findUser.restore()
    // 删除缓存
    await resetUserInfo([newUser])

    res.result(void 0, "恢复用户成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复用户失败~", false)
    )
  }
})
export default router
