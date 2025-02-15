// 引入 模拟 的数据
const menuData = require("./menulist")

// 引入 处理好的信息
const { userIds, roles, handlerRoleId } = require("./handlerRoleIds")

// 引入 去重函数
const { deduplication } = require("../../utils/array/deduplication/js")

let currentId = 1
const menus = []
const menuRoles = []

// 把 树形结构转为 菜单结构
const processMenu = (menu, parentId = null) => {
  const menuId = currentId++
  // 优先使用 数据里 的 role
  const menuRole = deduplication(handlerRoleId(roles, menu.role)).filter(
    Boolean
  )
  // 判断 处理后 优先使用 的role 是否有数据 没有使用 user权限
  const $roles = menuRole.length ? menuRole : userIds
  menus.push({
    id: menuId,
    name: menu.name,
    icon: menu.icon,
    to: menu.to,
    parentId,
    bannerImg: JSON.stringify(menu.bannerImg),
    layout: JSON.stringify(menu.layout),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  $roles.forEach((roleId) => {
    menuRoles.push({
      menuId,
      roleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  if (menu.children) {
    menu.children.forEach((child) => processMenu(child, menuId))
  }
}

// 处理 数据 得到  menus, menuRoles
menuData.forEach((menu) => processMenu(menu))

module.exports = { menus, menuRoles }
