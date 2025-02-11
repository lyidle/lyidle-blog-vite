// 直接修改 user的dataValues添加role 移除 Roles 需要是一个数组 哦 findOne 单个结果的 需要[findUser]
export const handlerUserRoles = (findUser: any[], cb?: (item: any) => void) => {
  findUser.forEach((item) => {
    // 回调函数 把item 传入
    cb && cb(item)
    // 把 role 变为 string[]
    const roles = item.dataValues.Roles

    delete item.dataValues.Roles
    item.dataValues.role = roles.map((item: { name: string }) => item.name)
  })
}
