import { delKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
// 引入 模型
const { Role } = require("@/db/models")
const router = express.Router()

// 获取权限菜单列表
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, desc } = req.body

    const setData = {
      name,
      desc,
    }

    // 创建权限
    const result = await Role.create(setData)

    // 获取所有角色 保存的键
    const cacheKey = "roles:*"

    // 返回并 删除缓存
    await delKey(cacheKey)
    res.result(result, "创建角色成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "创建角色失败", false)
    )
  }
})
export default router
