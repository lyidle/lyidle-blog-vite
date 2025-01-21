import { Op, literal } from "sequelize"
// 引入类型
import { Request, Response } from "express"
// 导入模型
const { Article, User } = require("@/db/models")
interface RequestData {
  id?: string
  account?: string
  email?: string
  role?: string[]
  nickName?: string
}
// 搜索函数
export default async (
  data: RequestData | Request["query"],
  req: Request,
  res: Response,
  exact?: boolean
) => {
  const { id, account, email, role, nickName } = data

  const commend: any = {
    include: [
      {
        model: Article, // 包括 Article 模型
        attributes: ["title", "category", "tags", "userId", "length", "id"], // 可以指定要查询的字段
      },
    ],
    attributes: { exclude: ["pwd"] },
  }

  if (!(id || account || email || role || nickName))
    return res.result(
      void 0,
      "请至少传入id、account、email、role、nickName中的一个参数~",
      false
    )

  // 按照nickName查询
  if (nickName)
    commend.where = {
      nickName: { [Op.like]: `%${nickName}%` },
    }

  // 按照nickName精确查询
  if (nickName && exact)
    commend.where = {
      nickName: nickName,
    }

  // 按照角色查询
  if (role) commend.where = literal(`JSON_CONTAINS(role, '"${role}"')`)

  // 按照邮箱查询
  if (email)
    commend.where = {
      email,
    }

  // 按照账号查询
  if (account)
    commend.where = {
      account: { [Op.like]: `%${account}%` },
    }

  // 按照账号精确查询
  if (account && exact)
    commend.where = {
      account: account,
    }

  // 按照id查询
  if (id) {
    commend.where = {
      id,
    }
  }
  commend.where.isBin = 0
  // 查询用户的所有文章
  const findUser = await User.findAll(commend)
  if (JSON.stringify(findUser) === "[]")
    return res.result({ msg: data }, "查询用户信息失败~", false)
  res.result(findUser, "查询用户信息成功~")
  return findUser
}
