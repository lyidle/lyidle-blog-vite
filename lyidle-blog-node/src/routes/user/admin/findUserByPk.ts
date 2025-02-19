// 引入 模型
const { User, Role } = require("@/db/models")
export const findUserByPk = async (id: number) => {
  return await User.findByPk(id, {
    paranoid: false,
    include: [
      {
        model: Role,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
      },
    ],
  })
}
