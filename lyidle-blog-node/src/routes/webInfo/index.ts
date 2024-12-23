import express from "express"
// 引入统计访问量
import visitor from "./visitor"
const router = express.Router()
// 引入模型
const { Article, Visitor, User, UserInfo, Setting } = require("@/db/models")
router.get("/", async (req, res, next) => {
  // 统计访客信息
  await visitor(req, next)
  // 查询文章信息
  const { rows, count } = await Article.findAndCountAll({
    attributes: ["updatedAt"],
    order: [
      ["updatedAt", "desc"],
      ["id", "desc"],
    ],
  })
  // 查询建站时间
  const { content: createWebAt } = await Setting.findOne({
    where: { name: "createWebAt" },
    attributes: ["content"],
  })
  // 查询用户信息用于统计
  const findUserInfo = await UserInfo.findAll({
    attributes: ["tags", "categories", "totalWords"],
  })
  const tourist = await Visitor.count()
  // 用户数
  const userCounts = await User.count()
  // 总访问量
  const totalVisitor = userCounts + tourist
  return res.result(
    {
      // 总文章数
      totalPages: count,
      // 访客数
      tourist,
      // 总访问量
      totalVisitor,
      // 创站时间
      createWebAt,
      // 最后更新时间
      updatedAt: rows[0].updatedAt,
      UserInfo: findUserInfo,
    },
    "查询网站咨询成功~"
  )
})
export default router
