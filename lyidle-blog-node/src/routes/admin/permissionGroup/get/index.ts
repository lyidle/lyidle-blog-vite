import { getKey, getKeys, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
const { Permission, PermissionGroup } = require("@/db/models")
const router = express.Router()
// 查询 权限菜单的回调
const getMenuList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 保存 redis 的键
    let cacheKey = `permissionGroup:*`
    const cacheValue = await getKey(cacheKey)
    // 判断有无 缓存
    if (cacheValue) return res.result(cacheValue, "获取权限菜单成功~")
    const permissionGroup = await PermissionGroup.findAll({
      include: [
        {
          model: Permission,
          as: "children",
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        },
      ],
    })

    if (!permissionGroup.length) {
      return res.result(void 0, "暂无权限访问任何权限菜单哦~", false)
    }

    // 设置 缓存
    await setKey(cacheKey, permissionGroup)
    return res.result(permissionGroup, "获取权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取权限菜单失败~", false)
    )
  }
}

// 获取权限菜单列表
router.get("/", getMenuList)
export default router
