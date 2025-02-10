import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入搜素函数
import search from "@/routes/user/search/search"
// 引入redis
import { setKey, getKey } from "@/utils/redis"
const router = express.Router()
// 获取当前token用户信息
router.get(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      const id = req.auth.id

      // 缓存用户信息
      const cacheValue = await getKey(`userInfo:${id}`)
      if (cacheValue) return res.result(cacheValue, "获取用户信息成功~")
      // 查询对应id的信息
      const findUser = await search({ id: id as string }, req, res, true, true)
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
