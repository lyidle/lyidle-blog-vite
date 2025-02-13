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
  currentPage?: number
  pageSize?: number
}

// 搜索函数
export default async (
  data: RequestData | { [key in string]: any },
  res: Response,
  exact: boolean = false,
  isCounts: boolean = false,
  isPagination: boolean = true
) => {
  const { id, account, email, role, nickName, currentPage, pageSize } = data

  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  let $currentPage
  let $pageSize
  let offset

  const commend: any = {
    include: [
      {
        model: Article,
        as: "articles",
        attributes: ["category", "tags", "id"],
        required: false, // 避免用户没有文章时被过滤掉
      },
      {
        model: Role,
        as: "role",
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        where: role ? { name: role } : {}, // 传入 role 时查询对于的 role 没有时 查询全部
        required: Boolean(role), // 没有 role 时 防止被过滤 有 role时过滤
      },
    ],
    attributes: { exclude: ["pwd"] }, //排除密码
    distinct: true, // 避免重复计数
  }

  if (isPagination) {
    $currentPage = Math.abs(Number(currentPage)) || 1
    $pageSize = Math.abs(Number(pageSize)) || 10
    offset = ($currentPage - 1) * $pageSize
    commend.limit = $pageSize
    commend.offset = offset
  }

  commend.where = {}

  if (!(id || account || email || role || nickName)) {
    delete commend.where
  }

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
  const { count, rows } = await User.findAndCountAll(commend)
  if (!rows.length) {
    res.result(void 0, "查询用户信息失败~", false)
    return
  }

  // 调用处理用户权限的 函数
  const users = handlerUserRoles(rows, (item) => {
    const articles = item.articles
    // 删除 articles 字段
    delete item.articles
    // 整理个数
    if (isCounts) {
      const { pages, tags, categories } = tinyUserDocsCounts(articles)
      item.counts = { pages, tags, categories }
    }
  })

  let result = users

  if (isPagination) {
    result = {
      pagination: {
        total: count,
        currentPage: $currentPage,
        pageSize: $pageSize,
      },
      users,
    }
  }

  // 调用处理用户权限的 函数
  return result
}
