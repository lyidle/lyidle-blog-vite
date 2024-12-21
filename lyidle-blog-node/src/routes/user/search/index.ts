import express from "express"
import { Op } from "sequelize"
const router = express.Router()
// 导入模型
const { Article, User, UserInfo } = require("@/db/models")
// 计算数量
const totalCounts = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    // 数量变量
    let totalPages = 0
    let totalTips = 0
    let totalCategories = 0
    let totalWords = 0
    const userId = item.dataValues.id
    const userInfo = await UserInfo.findOne({ where: { userId } })
    // 找到对应用户
    if (userInfo) {
      // 解构出需要的
      const {
        articleCounts,
        tipArrays,
        categoryArrays,
        totalWords: words,
      } = userInfo.dataValues
      // 计算数量
      totalPages = Number(articleCounts)
      totalTips = tipArrays.length
      totalCategories = categoryArrays.length
      totalWords = Number(words)
    }
    // 增加属性
    item.dataValues.counts = {
      totalPages,
      totalTips,
      totalCategories,
      totalWords,
    }
  }
}
// 搜索函数
const search = async (req: any, res: any, exact?: boolean) => {
  const { id, account, email, role, nickName } = req.query
  const commend: any = {
    include: [
      {
        model: Article, // 包括 Article 模型
        attributes: ["title", "category", "tip"], // 可以指定要查询的字段
      },
    ],
    attributes: { exclude: ["pwd", "createdAt", "updatedAt"] },
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
  // 查询用户的所有文章
  const findUser = await User.findAll(commend)
  // 计算数量
  await totalCounts(findUser)
  if (JSON.stringify(findUser) === "[]")
    return res.result(void 0, "查询用户信息失败~", false, 400)
  return res.result(findUser, "查询用户信息成功~")
}
// 模糊搜索
router.get("/", async (req, res) => {
  await search(req, res)
})
/* 
  精确搜索 
  nickName
  account
*/
router.get("/exact", async (req, res) => {
  await search(req, res, true)
})
export default router
