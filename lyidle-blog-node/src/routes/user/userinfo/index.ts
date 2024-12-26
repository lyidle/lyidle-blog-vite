import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwt, jwtExpand } from "@/middleware/auth"
const router = express.Router()
// 导入模型
const { UserInfo, User } = require("@/db/models")
// 获取当前token用户信息
router.get(
  "/",
  [jwt, jwtExpand],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 处理基础信息
      const { id } = req.auth
      // 查询用户信息 统计个数
      const findUser = await User.findOne({
        where: { id },
        attributes: {
          exclude: ["pwd", "status"],
        },
        include: [
          {
            model: UserInfo,
            attributes: {
              exclude: ["UserId", "userId"],
            },
          },
        ],
      })
      return res.result(findUser, "获取用户信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "获取用户信息失败~", false)
      )
    }
  }
)
export default router
