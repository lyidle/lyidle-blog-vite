import { deduplication } from "@/utils/array/deduplication"

// 直接修改 user的dataValues添加role 移除 Roles 需要是一个数组 哦 findOne 单个结果的 需要[findUser]
type callbackType = (item: any) => void

// 定义 options 参数的类型
type handlerUserRolesOptions = {
  cb?: callbackType // 可选的回调函数，用于自定义处理逻辑
  isPermission?: boolean // 可选的布尔值，表示是否需要处理权限
}

/**
 * 处理用户的 Roles
 * @param findUser 用户数据数组，通常是查询到的用户数据
 * @param options 可选的配置对象，包含回调函数和权限处理标志
 * @property options.cb 回调函数，用于自定义处理用户数据
 * @property options.isPermission 是否处理权限的标志 当处理权限时 查询的 Permission 需要使用 permissions的别名
 * @returns 根据 options 的配置返回处理后的结果
 */
export const handlerUserRoles = (
  findUser: any[], // 用户数据数组，类型为 any[]，可以根据实际情况替换为具体的类型
  options?: handlerUserRolesOptions // 可选的配置对象
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

type paramsType = { [key in string]: any }[]

// 处理 Roles 为 string[]
export const _handlerRoles = (Roles: paramsType) => {
  return deduplication(Roles.map((item) => item.name)).filter(Boolean)
}

/**
 * @param Permissions 传入单个的Permissions
 * @returns 返回 处理好的 Permissions 的名单 string[]
 */
export const handlerPermissions = (Permissions: paramsType) => {
  // 去重 加 过滤
  return deduplication(
    Permissions.reduce((acc, role) => {
      role.PermissionGroups.forEach((group: any) => {
        // 将权限组名称添加到 permissions 数组中
        if (!acc.includes(group.name)) {
          acc.push(group.name)
        }
        // 将权限名称添加到 permissions 数组中
        group.permissions.forEach((permission: any) => {
          if (!acc.includes(permission.name)) {
            acc.push(permission.name)
          }
        })
      })
      return acc
    }, []) as string[]
  ).filter(Boolean)
}

/**
 * @param includeRolesModel 第一个子集包含Roles的查询结果
 * @returns 返回 处理好的 roles 的名单 string[]
 */
export const ReturnRoles = (includeRolesModel: string[]) => {
  const data = JSON.parse(JSON.stringify(includeRolesModel))
  // 把 roles 变为 string[]
  return deduplication(
    data.map((item: any) => item.Roles.map((item: any) => item.name))
  ).filter(Boolean) as string[]
}
