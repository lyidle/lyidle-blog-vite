import { getKey, setKey } from "@/utils/redis"
import express from "express"
const { Menu, Role } = require("@/db/models")
const router = express.Router()

// 将角色对象数组转换为角色名称数组 string[]
const returnRoles = (role: any) => {
  return role.map((item: any) => item.name)
}

// 构建菜单树
const buildMenuTree = ($menus: any[]) => {
  // 深度克隆
  const menu = JSON.parse(JSON.stringify($menus))

  // 使用 Map 存储菜单项
  const menuMap = new Map<number, any>()

  // 将每一项存入 Map
  menu.forEach((item: any) => {
    menuMap.set(item.id, {
      ...item,
      role: returnRoles(item.role), //处理 role 为 string[]
      children: [],
    })
  })

  const menuTree: any[] = []

  // 构建树形结构
  menuMap.forEach((item) => {
    if (item.parentId) {
      const parent = menuMap.get(item.parentId)
      // 如果有父节点，则添加到父节点的 children 中,否则归类到顶层
      parent ? parent.children.push(item) : menuTree.push(item)
    } else {
      // 顶层节点直接添加到 menuTree
      menuTree.push(item)
    }
  })

  return menuTree
}

// 获取菜单列表
router.get("/", async (req, res, next) => {
  const role = req.query?.role || "admin" // 从请求中获取角色名称

  // 保存 redis 的键
  let cacheKey = `menu:${role}`
  const cacheValue = await getKey(cacheKey)
  // 判断有无 缓存
  if (cacheValue) return res.result(cacheValue, "获取菜单成功~")

  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name"], // 只获取角色名称
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          where: { name: role }, // 根据角色名称过滤菜单
          required: true, // 只返回与指定角色关联的菜单
        },
      ],
    })

    // 处理菜单中的 role 为 string[]
    const result = buildMenuTree(menus)

    if (!menus.length) {
      return res.result(void 0, "暂无权限访问任何菜单哦~", false)
    }
    // 设置 缓存
    await setKey(cacheKey, menus)
    return res.result(result, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
})

export default router
