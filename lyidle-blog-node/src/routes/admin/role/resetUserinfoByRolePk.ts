//  引入 清除 Users 的信息 缓存 的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"

// 引入 模型
const { Role, User } = require("@/db/models")
export const resetUserinfoByRolePk = async (id: number) => {
  const result = await Role.findByPk(id, {
    include: [
      {
        model: User,
        paranoid: false,
        attributes: ["id", "account"],
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"], // 只获取角色名称
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            required: true, //按照 role时 过滤 User 的数据
          },
        ],
      },
    ],
  })
  // resetUserInfo()
}
