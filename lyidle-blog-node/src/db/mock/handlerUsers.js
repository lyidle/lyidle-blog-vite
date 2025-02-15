// 导入环境变量
require("dotenv").config()

// 引入 去重函数
const { deduplication } = require("../../utils/array/deduplication/js")

// 加密
const bcrypt = require("bcryptjs")

// 引入 处理好的信息
const { adminIds, userIds, ownerIds, docIds } = require("./handlerRoleIds")

// 插入用户信息
const users = []
// 插入用户 关联的角色信息
const userRoles = []
const userCounts = 5
for (let i = 1; i <= userCounts; i++) {
  const userId = i
  // 默认 是 user
  let roleIds = userIds
  // 第一个是 owner
  if (i === 1) roleIds = deduplication(userIds, ownerIds, docIds)
  // 第二个是 admin
  if (i === 2) roleIds = deduplication(userIds, ownerIds, docIds)
  users.push({
    id: userId,
    account: `test${i}`,
    nickName: `test${i}`,
    pwd: bcrypt.hashSync("123456", 10),
    email: `test${i}@example.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  roleIds.forEach((roleId) => {
    userRoles.push({
      userId,
      roleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })
}
module.exports = {
  users,
  userRoles,
}
