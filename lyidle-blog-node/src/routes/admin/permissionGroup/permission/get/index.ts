import { getKey, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
const { Permission } = require("@/db/models")
// 引入 pagination 接口
import pagination from "./pagination"
const router = express.Router()
// 获取子权限菜单列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 保存 redis 的键
    let cacheKey = `permissions:*`
    const cacheValue = await getKey(cacheKey)
    // 判断有无 缓存
    if (cacheValue) return res.result(cacheValue, "获取子权限菜单成功~")
    const findPermission = await Permission.findAll()

    if (!findPermission.length) {
      return res.result(void 0, "子权限菜单未初始化哦~", false)
    }

    // 设置 缓存
    await setKey(cacheKey, findPermission)
    return res.result(findPermission, "获取子权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取子权限菜单失败~", false)
    )
  }
})
// 按照 分页器的格式查询
router.use("/pagination", pagination)
export default router
