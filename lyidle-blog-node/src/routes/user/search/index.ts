import express from "express"
import { Op } from "sequelize"
const router = express.Router()
// 导入模型
const { Article, User, UserInfo } = require("@/db/models")
// 搜索函数
const search = async (req: any, res: any, exact?: boolean) => {
  const { id, account, email, role, nickName } = req.query
  const commend: any = {
    include: [
      {
        model: Article, // 包括 Article 模型
        attributes: ["title", "category", "tags", "userId"], // 可以指定要查询的字段
      },
      {
        model: UserInfo, // 包括 Article 模型
        attributes: { exclude: ["UserId"] },
      },
    ],
    attributes: { exclude: ["pwd"] },
  }
  if (!(id || account || email || role || nickName))
    return res.result(
      void 0,
      "请至少传入id、account、email、role、nickName中的一个参数~",
      false,
      400
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
  if (role)
    commend.where = {
      role: role,
    }
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
  commend.where.status = 0
  // 查询用户的所有文章
  const findUser = await User.findAll(commend)
  // 计算数量
  // await totalCounts(findUser)
  if (JSON.stringify(findUser) === "[]")
    return res.result(void 0, "查询用户信息失败~", false)
  return res.result(findUser, "查询用户信息成功~")
}
// 模糊搜索
router.get("/", async (req, res, next) => {
  try {
    await search(req, res)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询用户信息失败~", false)
    )
  }
})
/* 
  精确搜索 
  nickName
  account
*/
router.get("/exact", async (req, res, next) => {
  try {
    await search(req, res, true)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询用户信息失败~", false)
    )
  }
})
export default router
