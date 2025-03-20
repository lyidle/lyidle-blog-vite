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
    return next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new myError("UnauthorizedError"))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new myError("UnauthorizedError"))
    }
    // 打印其他可能的错误
    console.error("jwt出错", error)
    return next(new myError("UnauthorizedError"))
  }
}

// 游客 的验证 ，有游客token 或者 用户token 就算通过
export const isTourist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 判断 有无 userToken
  let userToken = null

  // 验证 用户 token 判断是否通过
  try {
    // 从请求头中获取 Token
    const token = req.headers.authorization?.split(" ")[1]

    // 有 token
    if (token) {
      // 验证 JWT
      const decoded = jwt.verify(
        token,
        process.env.jwt_hash!
      ) as typeof req.auth // 解析 Token

      const { id } = decoded // 从 Token 中获取用户 ID

      // 检查 Redis 中是否存在该用户的 Token
      const findUser = await getKey(`token:${id}`)
      if (findUser) userToken = findUser
    }
  } catch (error) {}

  // 游客totken
  const touristToken = (req.headers["authorization-tourist"] as string)?.split(
    " "
  )[1]
  // 游客 token 和 用户 token 都没有时报错
  if (!touristToken && !userToken) {
    return next(new myError("UnauthorizedError"))
  }
  try {
    // 验证 JWT
    let isAccess = jwt.verify(touristToken, process.env.jwt_hash!) as string

    // 挂载 到 req 上
    req.isAccess = isAccess || userToken
    // 如果验证通过，继续执行后续中间件
    return next()
  } catch (error) {
    // 有 用户 token  则通过
    if (userToken) return next()

    if (error instanceof jwt.TokenExpiredError) {
      return next(new myError("UnauthorizedError"))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new myError("UnauthorizedError"))
    }
    // 打印其他可能的错误
    console.error("jwt出错", error)
    return next(new myError("UnauthorizedError"))
  }
}

// 管理员权限验证
const default_admin = process.env.default_admin!

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { roles: userRole } = req.auth
  // 判断是否有权限
  if (!userRole.includes(default_admin))
    return next(
      new myError("otherError", `无权限访问该接口: ${req.originalUrl}`)
    )

  next()
}
