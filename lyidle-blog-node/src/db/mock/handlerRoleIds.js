// 导入环境变量
require("dotenv").config()

// 引入 去重函数
const { deduplication } = require("../../utils/array/deduplication/js")

// 引入 处理好的信息
const { Roles } = require("../mock/handlerPermissions")

// 默认的 角色
const default_owner = process.env.default_owner
const default_user = process.env.default_user
const default_admin = process.env.default_admin

const handlerRoleId = (roles, setRoles) => {
  return setRoles.map((item) => roles[item])
}

// 处理成 名字 对应 id 的形式
const roles = Roles.reduce((pre, cur) => {
  const item = cur
  pre[item.name] = item.id
  return pre
}, {})

// owner 角色id
const ownerIds = deduplication(handlerRoleId(roles, [default_owner])).filter(
  Boolean
)
// admin 角色id
const adminIds = deduplication(handlerRoleId(roles, [default_admin])).filter(
  Boolean
)
// user 角色id
const userIds = deduplication(handlerRoleId(roles, [default_user])).filter(
  Boolean
)

module.exports = {
  adminIds,
  userIds,
  ownerIds,
  handlerRoleId,
  roles,
}
