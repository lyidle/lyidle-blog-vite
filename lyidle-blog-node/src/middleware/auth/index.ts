// 类型
import type { Request, Response, NextFunction } from "express"
// 引用封装的错误函数
import { myError } from "@/utils/Error"
// 引入模型
const { User } = require("@/db/models")

const { expressjwt } = require("express-jwt")

export const jwt = expressjwt({
  secret: process.env.HASH,
  algorithms: ["HS256"],
})

// 用于判断是否修改了自身等
export const jwtExpand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.auth
  const findUser = await User.findByPk(id)
  // 没有token了就返回 没有权限
  if (!findUser?.dataValues?.token) next(new myError("UnauthorizedError"))
  next()
}

const adminData: string[] = JSON.parse(process.env.Admin as string)

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role: userRole } = req.auth
  // 判断是否有权限
  if (!adminData.some((item) => item === userRole))
    next(new myError("PermissionError~"))
  next()
}
