// 类型
import type { Request, Response, NextFunction } from "express"
// 引用封装的错误函数
import myError from "@/utils/error/myError"
// 引入redis
import { getKey } from "@/utils/redis"

// 设置 token
const jwt = require("jsonwebtoken")
// 普通用户的验证
export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头中获取 Token
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return next(new myError("UnauthorizedError"))
    }

    // 验证 JWT
    const decoded = jwt.verify(token, process.env.jwt_hash!) as typeof req.auth // 解析 Token

    const { id } = decoded // 从 Token 中获取用户 ID

    // 检查 Redis 中是否存在该用户的 Token
    const findUser = await getKey(`token:${id}`)

    if (!findUser || findUser !== token) {
      return next(new myError("UnauthorizedError"))
    }

    // 将用户信息挂载到 req 对象上
    req.auth = decoded

    // 如果验证通过，继续执行后续中间件
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new myError("UnauthorizedError"))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new myError("UnauthorizedError"))
    }
    next(error) // 捕获其他可能的错误
  }
}

// 管理员权限验证
const adminData: string[] = JSON.parse(process.env.default_admin!)

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { roles: userRole } = req.auth
  // 判断是否有权限
  if (!adminData.some((item) => userRole.includes(item)))
    return next(
      new myError("otherError", `无权限访问该接口: ${req.originalUrl}`)
    )

  next()
}
