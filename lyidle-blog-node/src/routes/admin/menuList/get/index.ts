import express from "express"
const { Menu, Role } = require("@/db/models")
const router = express.Router()

// 处理菜单中的 role 为 string[]
const handlerMenuRole = ($menus: any[]) => {
  // 将角色对象数组转换为角色名称数组
  const returnRoles = (role: any) => {
    return role.map((item: any) => item.name)
  }

  // 递归处理菜单项
  const processMenu = (menu: any) => {
    // 转换当前菜单项的 role 字段
    if (menu.role) {
      menu.role = returnRoles(menu.role)
    }

    // 递归处理 children
    if (menu.children && menu.children.length) {
      menu.children = menu.children.map(processMenu)
    }

    return menu
  }

  // 处理所有菜单项
  const menu = JSON.parse(JSON.stringify($menus))
  return menu.map(processMenu)
}

// 获取菜单列表
router.get("/", async (req, res, next) => {
  const role = req.query?.role || "admin" // 从请求中获取角色名称
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
        {
          model: Menu,
          as: "children",
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["name"], // 只获取角色名称
              through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
              where: { name: role }, // 根据角色名称过滤子菜单
              required: true, // 只返回与指定角色关联的子菜单
            },
          ],
        },
      ],
    })

    // 处理菜单中的 role 为 string[]
    const result = handlerMenuRole(menus)

    if (!menus.length) {
      return res.result(void 0, "暂无权限访问任何菜单哦~", false)
    }

    return res.result(result, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
})

export default router
