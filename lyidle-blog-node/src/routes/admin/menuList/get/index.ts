import { getKey, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
import { Op } from "sequelize"
// 处理 Roles 为 string[]
import { _handlerRoles } from "@/utils/db/handlerRoles"
// 保存 redis 的键 确保 顺序和删除的 缓存时的顺序一致
import { saveMenuCache } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { Menu, Role } = require("@/db/models")
const router = express.Router()

const ms = require("ms")
const default_expire = ms(process.env.default_expire)
// 构建菜单树
const buildMenuTree = ($menus: any[]) => {
  // 深度克隆
  const menu = JSON.parse(JSON.stringify($menus))

  // 使用 Map 存储菜单项
  const menuMap = new Map<number, any>()

  // 将每一项存入 Map
  menu.forEach((item: any) => {
    const roles = _handlerRoles(item.Roles)
    delete item.Roles
    menuMap.set(item.id, {
      ...item,
      roles, //处理 roles 为 string[]
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

// 查询 菜单的回调
const getMenuList = async (
  req: Request,
  res: Response,
  next: NextFunction,
  isAll: boolean = false
) => {
  try {
    let roles = req.query?.roles && JSON.parse(req.query.roles as string) // 从请求中获取角色名称
    if (!isAll && (!Array.isArray(roles) || !roles.length))
      return res.result(void 0, "暂无权限访问任何菜单", false)

    // 判断 是否查询所有菜单
    if (isAll) roles = "*"
    // 保存 redis 的键 确保 缓存时的顺序一致 避免重复缓存
    let cacheKey = saveMenuCache(roles) || ""
    const cacheValue = await getKey(cacheKey)
    // 判断有无 缓存
    if (cacheValue) {
      if (cacheValue === "notFind")
        return res.result(void 0, "暂无权限访问任何菜单", false)

      return res.result(cacheValue, "获取菜单成功~")
    }
    const menus = await Menu.findAll({
      include: [
        {
          model: Role,
          attributes: ["name"],
          through: { attributes: [] },
          where: isAll ? {} : { name: { [Op.in]: roles } }, // 根据角色名称过滤菜单
          required: isAll ? false : Boolean(roles), // isAll 时不过滤 Menu 否则 当有 roles 时需要过滤
        },
      ],
    })
    if (!menus.length) {
      // 设置 缓存
      if (cacheKey) await setKey(cacheKey, "notFind", default_expire)
      return res.result(void 0, "暂无权限访问任何菜单", false)
    }

    // 处理菜单中的 递归 菜单 从而形成 树状结构
    const result = buildMenuTree(menus)

    // 设置 缓存
    if (cacheKey) await setKey(cacheKey, result, default_expire)
    return res.result(result, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
}

// 获取菜单列表
router.get("/", async (req, res, next) => {
  await getMenuList(req, res, next)
})

// 获取菜单列表
router.get("/*", async (req, res, next) => {
  await getMenuList(req, res, next, true)
})
export default router
