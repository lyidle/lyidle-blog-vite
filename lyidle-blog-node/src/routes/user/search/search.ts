import { Op, literal } from "sequelize"
// 引入类型
import { Request, Response } from "express"
// 引入 整理 个数的函数
import { tinyUserDocsCounts } from "@/utils/doc/counts"
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
  exact?: boolean,
  isCounts: boolean = false
) => {
  const { id, account, email, role, nickName } = data

  if (!(id || account || email || role || nickName)) {
    res.result(
      void 0,
      "查询用户，请至少传入id、account、email、role、nickName中的一个参数~",
      false
    )
    return
  }

  const commend: any = {
    include: [
      {
        model: Article, // 包括 Article 模型
        attributes: [
          "poster",
          "title",
          "category",
          "tags",
          "userId",
          "length",
          "createdAt",
          "updatedAt",
          "id",
        ], // 可以指定要查询的字段
        where: {
          isBin: null,
        },
      },
    ],
    attributes: { exclude: ["pwd"] },
  }

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

  // 查询用户的所有文章
  const findUser = await User.findAll(commend)
  if (!findUser.length) {
    res.result(void 0, "查询用户信息失败~", false)
    return
  }
  // 整理 个数
  findUser.forEach((item: any) => {
    const articles = item.dataValues.Articles
    delete item.dataValues.Articles
    if (isCounts) {
      const { pages, tags, categories } = tinyUserDocsCounts(articles)
      item.dataValues.counts = {
        pages,
        tags,
        categories,
      }
    }
  })
  return findUser
}
