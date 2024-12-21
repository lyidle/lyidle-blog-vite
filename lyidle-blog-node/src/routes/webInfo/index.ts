import express from "express"
// 引入数值转中文
import numberToChineseUnit from "@/utils/numberToChineseUnit"
// 引入时间转换
import moment from "@/utils/moment"
// 引入统计访问量
import visitor from "./visitor"
const router = express.Router()
// 统计数量函数
const totalCounts = (data: any) => {
  // 总数变量
  let tips = 0
  let categories = 0
  let words = 0
  // 定义set 去重
  let tipSet: null | Set<any> = new Set()
  let categorySet: null | Set<any> = new Set()
  // 没有 数据 就直接返回
  if (!data.length)
    return {
      tips,
      categories,
      words,
    }
  data.forEach((item: any) => {
    const { tipArrays, categoryArrays, totalWords } = item.dataValues
    tipArrays.forEach((item: any) => {
      tipSet?.add(item)
    })
    categoryArrays.forEach((item: any) => {
      categorySet?.add(item)
    })
    words += totalWords
  })
  tips = tipSet.size
  categories = categorySet.size
  // 释放Set
  tipSet = null
  categorySet = null
  return {
    tips,
    categories,
    words,
  }
}
// 引入模型
const { Article, Visitor, User, UserInfo } = require("@/db/models")
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
  const findUserInfo = await UserInfo.findAll({
    attributes: ["tipArrays", "categoryArrays", "totalWords"],
  })
  // 统计总数
  const {
    tips: totalTips,
    categories: totalCategories,
    words: totalWords,
  } = totalCounts(findUserInfo)
  // 查询访客数
  const tourist = await Visitor.count()
  // 用户数
  const userCounts = await User.count()
  // 总访问量
  const totalVisitor = userCounts + tourist
  // 整理数据
  const result = {
    // 总文章数
    totalPages: count,
    // 总标签数
    totalTips,
    // 总分类数
    totalCategories,
    // 总字数
    totalWords: numberToChineseUnit(totalWords),
    // 访客数
    tourist,
    // 总访问量
    totalVisitor,
    // 最后更新时间
    updatedAt: moment(rows[0].updatedAt, "YYYY-MM-DD"),
  }
  return res.result(result, "查询网站咨询成功~")
})
export default router
