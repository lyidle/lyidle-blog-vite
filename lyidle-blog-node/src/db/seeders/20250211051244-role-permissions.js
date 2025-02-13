"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    // 查询所有角色和权限
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM Roles;", // 去掉双引号
      { type: Sequelize.QueryTypes.SELECT }
    )
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM Permissions;", // 去掉双引号
      { type: Sequelize.QueryTypes.SELECT }
    )

    const rolePermissions = []

    // owner 和 admin 拥有所有权限
    roles.forEach((role) => {
      if (role.name === "owner" || role.name === "admin") {
        permissions.forEach((permission) => {
          rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        })
      }
    })

    // user 只有查看权限
    roles.forEach((role) => {
      if (role.name === "user") {
        permissions.forEach((permission) => {
          if (permission.name.split(":")[0].includes("read")) {
            rolePermissions.push({
              roleId: role.id,
              permissionId: permission.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
        })
      }
    })

    await queryInterface.bulkInsert("RolePermissions", rolePermissions, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RolePermissions", null, {})
  },
}
