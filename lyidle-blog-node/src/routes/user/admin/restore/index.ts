import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware } from "@/middleware/auth"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 模型
const { User, Role } = require("@/db/models")
const router = express.Router()

// 恢复用户
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.auth.id
    try {
      const findUser = await User.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      })

      if (!findUser)
        return res.result(void 0, "恢复用户失败,没有找到用户数据", false)

      // 恢复 用户
      await findUser.restore()
      // 删除缓存
      await resetUserInfo([findUser])

      res.result(void 0, "恢复用户成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复用户失败~", false)
      )
    }
  }
)
export default router
