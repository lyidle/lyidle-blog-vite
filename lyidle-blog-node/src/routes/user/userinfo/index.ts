import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入搜素函数
import search from "@/routes/user/search/search"
// 引入redis
import { setKey, getKey } from "@/utils/redis"
// 自定义错误
import myError from "@/utils/error/myError"
// 引入时间转换
const ms = require("ms")
const token_expire = ms(process.env.token_expire!)
const router = express.Router()
// 获取当前token用户信息
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      const id = req.auth.id
      if (!id) return next(new myError("UnauthorizedError"))

      // 缓存用户信息
      const cacheValue = await getKey(`userInfo:bin:${id}`)
      if (cacheValue) return res.result(cacheValue, "获取用户信息成功~")
      // 查询对应id的信息
      const findUser = await search({ id }, res, true, true, false, true, false)

      // 不存在
      if (!findUser) return next(new myError("UnauthorizedError"))
      // 存储用户信息 到 redis
      await setKey(`userInfo:bin:${id}`, findUser, token_expire)
      return res.result(findUser, "获取用户信息成功~")
    } catch (error) {
      next(new myError("UnauthorizedError"))
    }
  }
)
export default router
