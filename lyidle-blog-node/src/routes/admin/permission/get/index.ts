import { getKey, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
const { Permission } = require("@/db/models")
const router = express.Router()

// 构建权限菜单树
const buildMenuTree = ($permissions: any[]) => {
  // 深度克隆
  const menu = JSON.parse(JSON.stringify($permissions))

  // 使用 Map 存储权限菜单项
  const menuMap = new Map<number, any>()

  // 将每一项存入 Map
  menu.forEach((item: any) => {
    menuMap.set(item.id, {
      ...item,
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
  menuMap.clear()
  return menuTree
}

// 查询 权限菜单的回调
const getMenuList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 保存 redis 的键
    let cacheKey = `permission:*`
    const cacheValue = await getKey(cacheKey)
    // // 判断有无 缓存
    if (cacheValue) return res.result(cacheValue, "获取权限菜单成功~")
    const permissions = await Permission.findAll()

    // 处理权限菜单中的 递归 权限菜单 从而形成 树状结构
    const result = buildMenuTree(permissions)

    if (!permissions.length) {
      return res.result(void 0, "暂无权限访问任何权限菜单哦~", false)
    }
    // 设置 缓存
    await setKey(cacheKey, result)
    return res.result(result, "获取权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取权限菜单失败~", false)
    )
  }
}

// 获取权限菜单列表
router.get("/", getMenuList)
export default router
