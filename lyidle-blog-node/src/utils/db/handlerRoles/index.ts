import { deduplication } from "@/utils/array/deduplication"

// 直接修改 user的dataValues添加role 移除 Roles 需要是一个数组 哦 findOne 单个结果的 需要[findUser]
type callbackType = (item: any) => void

type handlerUserRolesOptions = { cb?: callbackType; isPermission?: boolean }

// 处理 用户的Roles
export const handlerUserRoles = (
  findUser: any[],
  options?: handlerUserRolesOptions
) => {
  const user = JSON.parse(JSON.stringify(findUser))
  const result = user.map((item: any) => {
    const roles = _handlerRoles(item.Roles)
    // 处理 roles 为 string[]
    item.roles = roles

    // 判断是否 处理 permissions
    if (options?.isPermission) {
      // 处理 permissions 为string[]
      item.permissions = handlerPermissions(item.Roles)
    }

    // 处理 完毕 删除 Roles
    delete item.Roles

    options?.cb && options.cb(item)
    return item
  })

  return result
}

type rolesType = { [key in string]: any }[]

// 处理 Roles 为 string[]
export const _handlerRoles = (Roles: rolesType) => {
  return deduplication(Roles.map((item) => item.name)).filter(Boolean)
}

// 把 权限 处理 成功 string[] 的形式
export const handlerPermissions = (Roles: rolesType) => {
  // 去重 加 过滤
  return deduplication(
    Roles.reduce((acc, role) => {
      role.PermissionGroups.forEach((group: any) => {
        // 将权限组名称添加到 permissions 数组中
        if (!acc.includes(group.name)) {
          acc.push(group.name)
        }
        // 将权限名称添加到 permissions 数组中
        group.Permissions.forEach((permission: any) => {
          if (!acc.includes(permission.name)) {
            acc.push(permission.name)
          }
        })
      })
      return acc
    }, []) as string[]
  ).filter(Boolean)
}

// 返回 处理好的 role 的名单 string[]
export const ReturnRoles = (includeRolesModel: any[]) => {
  const data = JSON.parse(JSON.stringify(includeRolesModel))
  // 把 role 变为 string[]
  return deduplication(
    data.map((item: any) => item.Roles.map((item: any) => item.name))
  ).filter(Boolean)
}
