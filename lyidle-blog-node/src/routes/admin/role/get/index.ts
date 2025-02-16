import { getKey, getKeys, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
const { Role } = require("@/db/models")
const router = express.Router()

// 获取权限菜单列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await Role.findAll()

    // 获取所有角色 保存的键
    const cacheKey = "roles:*"

    // 有缓存直接返回
    const cacheValue = await getKey(cacheKey)
    if (cacheValue) return res.result(cacheValue, "获取所有角色成功~")

    // 判断是否有 角色
    if (!roles?.length)
      return res.result(void 0, "服务器角色未初始化哦~", false)

    // 返回并设置缓存
    await setKey(cacheKey, roles)
    res.result(roles, "获取所有角色成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取所有角色失败哦~", false)
    )
  }
})
export default router
