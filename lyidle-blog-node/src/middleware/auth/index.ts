// 类型
import type { Request, Response, NextFunction } from "express"
// 引用封装的错误函数
import myError from "@/utils/Error"
// 引入redis
import { getKey } from "@/utils/redis"
// 引入jwt
import { expressjwt } from "express-jwt"

// 普通用户的验证
export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // express-jwt 验证
  expressjwt({
    secret: process.env.jwt_hash!,
    algorithms: ["HS256"],
  })(req, res, async (err) => {
    if (err) {
      return next(new myError("UnauthorizedError"))
    }
    try {
      const { id } = req.auth // 从 auth 中获取用户 ID
      // 检查 Redis 中是否存在 token
      const findUser = await getKey(`token:${id}`)
      if (!findUser) {
        return next(new myError("UnauthorizedError"))
      }
      // 如果验证通过，继续执行后续中间件
      next()
    } catch (error) {
      next(error) // 捕获其他可能的错误
    }
  })
}

// 管理员权限验证
const adminData: string[] = JSON.parse(process.env.Admin as string)
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role: userRole } = req.auth
  // 判断是否有权限
  if (!adminData.some((item) => item === userRole))
    next(new myError("PermissionError"))
  next()
}
