import { Op, literal } from "sequelize"
// 引入类型
import { Request, Response } from "express"
// 引入 整理 个数的函数
import { tinyUserDocsCounts } from "@/utils/db/doc"
// 引入 处理 用户的role 的函数
import { handlerUserRoles } from "@/utils/db/handlerRoles"
// 导入模型
const { Article, User, Role } = require("@/db/models")

interface RequestData {
  id?: string
  account?: string
  email?: string
  role?: string[] // 这里是数组，可能需要调整查询逻辑
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
        model: Article,
        attributes: ["category", "tags", "id"],
        where: {
          isBin: null,
        },
        required: false, // 避免用户没有文章时被过滤掉
      },
      {
        model: Role,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不获取中间表数据
        where: role ? { name: role } : {},
        required: Boolean(role), // 只有当 role 过滤时，才必须匹配
      },
    ],
    attributes: { exclude: ["pwd"] }, //排除密码
  }

  commend.where = {}

  // 按照 nickName 查询
  if (nickName) {
    commend.where.nickName = exact ? nickName : { [Op.like]: `%${nickName}%` }
  }

  // 按照邮箱查询
  if (email) commend.where.email = email

  // 按照账号查询
  if (account) {
    commend.where.account = exact ? account : { [Op.like]: `%${account}%` }
  }

  // 按照 id 查询
  if (id) commend.where.id = id

  // 查询用户
  const findUser = await User.findAll(commend)
  if (!findUser.length) {
    res.result(void 0, "查询用户信息失败~", false)
    return
  }

  // 调用处理用户权限的 函数
  handlerUserRoles(findUser, (item) => {
    const articles = item.dataValues.Articles
    delete item.dataValues.Articles
    // 整理个数
    if (isCounts) {
      const { pages, tags, categories } = tinyUserDocsCounts(articles)
      item.dataValues.counts = { pages, tags, categories }
    }
  })

  return findUser
}
