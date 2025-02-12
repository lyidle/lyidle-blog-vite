// 直接修改 user的dataValues添加role 移除 Roles 需要是一个数组 哦 findOne 单个结果的 需要[findUser]
export const handlerUserRoles = (findUser: any[], cb?: (item: any) => void) => {
  const user = JSON.parse(JSON.stringify(findUser))
  return user.map((item: any) => {
    // 把 role 变为 string[]
    const role = item.role
    item.role = role.map((item: any) => item.name)

    // 回调函数 把item 传入
    cb && cb(item)

    return item
  })
}
