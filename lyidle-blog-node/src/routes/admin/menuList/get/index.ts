import express from "express"
import { Sequelize } from "sequelize"
import { getKey, setKey } from "@/utils/redis" // Redis 缓存工具
const { Menu } = require("@/db/models") // 只需引入 Menu，MenuList 用 parentId 关系维护
const router = express.Router()

// 递归构造菜单树
const buildMenuTree = (menus: any, parentId = null) => {
  return (
    menus
      // 过滤出没有 parentId的
      .filter((menu: any) => menu.parentId === parentId)
      // 处理深层的 菜单 children
      .map((menu: any) => ({
        ...menu,
        children: buildMenuTree(menus, menu.id),
      }))
  )
}

// 获取菜单列表
router.get("/", async (req, res, next) => {
  try {
    const { role } = req.query
    if (!role) return res.result(void 0, "暂无权限访问任何菜单哦~", false)

    const cacheKey = `menu:${role}`

    // 先尝试从 Redis 获取缓存数据
    const cachedData = await getKey(cacheKey)
    if (cachedData) {
      return res.result(JSON.parse(cachedData), "获取菜单成功~")
    }

    const menus = await Menu.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(role, '["${role}"]')`), // MySQL JSON 查询
      raw: true, // 以对象数组返回
    })

    if (!menus.length) {
      return res.result(void 0, "暂无权限访问任何菜单哦~", false)
    }

    // 递归构建菜单树
    const menuTree = buildMenuTree(menus)

    // 设置 Redis 缓存 修改时 删除缓存
    await setKey(cacheKey, JSON.stringify(menuTree))

    return res.result(menuTree, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
})

export default router
