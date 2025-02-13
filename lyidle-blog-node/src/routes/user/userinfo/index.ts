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
const router = express.Router()
// 获取当前token用户信息
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      const id = req.auth.id
      if (!id)
        throw new myError("otherError", "获取用户信息时 jwt 出错没有id哦~")

      // 缓存用户信息
      const cacheValue = await getKey(`userInfo:${id}`)
      if (cacheValue) return res.result(cacheValue, "获取用户信息成功~")
      // 查询对应id的信息
      const findUser = await search({ id }, res, true, true, false)
      // 不存在
      if (!findUser) return
      // 存储用户信息 到 redis
      await setKey(`userInfo:${id}`, findUser)
      return res.result(findUser, "获取用户信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "获取用户信息失败~", false)
      )
    }
  }
)
export default router
