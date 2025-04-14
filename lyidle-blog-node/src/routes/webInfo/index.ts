import express from "express"
// 引入 big.js
import Big from "big.js"
const router = express.Router()
// 引入模型
const { Article, Visitor, User } = require("@/db/models")
// 引入 redis 设置缓存
import { setKey, getKey } from "@/utils/redis"
router.get("/", async (req, res, next) => {
  try {
    // 获取创建站的时间
    let webCreatedAt = await getKey("webCreatedAt")
    if (webCreatedAt === null)
      webCreatedAt = await setKey("webCreatedAt", new Date())

    // 获取到访客数量
    let touristCounts = await getKey("touristCounts")
    if (touristCounts === null) {
      // 查询游客量
      touristCounts = await Visitor.count()
      await setKey("touristCounts", `${touristCounts}`)
    }

    // 查询用户数量
    let webUserCounts = await getKey("userCounts")

    if (webUserCounts === null) {
      // 得到 用户数量
      webUserCounts = await User.count()
      await setKey("userCounts", `${webUserCounts}`)
    }

    // 总访问量
    // 总访问量 = 注册用户数 + 游客数
    const webTotalPersonCounts = new Big(webUserCounts || 0)
      .plus(new Big(touristCounts || 0))
      .toString()

    // 网页总数
    let webTotalPages = await getKey("webTotalPages")
    if (webTotalPages === null) {
      webTotalPages = await Article.count()
      await setKey("webTotalPages", `${webTotalPages}`)
    }

    // 最后更新时间
    let webUpdatedAt = await getKey("webUpdatedAt")
    if (webUpdatedAt === null)
      webUpdatedAt = await setKey("webUpdatedAt", new Date())

    // 获取字数
    // 从Redis获取缓存的总字数
    let webTotalWords = await getKey("webTotalWords")

    // 如果缓存不存在，从数据库重新计算
    if (webTotalWords === null) {
      // 查询所有文章的字数
      const Articles = await Article.findAll({ attributes: ["length"] })

      // 使用Big.js初始化总字数
      let totalLength = new Big(0)

      // 遍历所有文章累加字数
      JSON.parse(JSON.stringify(Articles)).forEach((item) => {
        totalLength = totalLength.plus(new Big(item.length || 0))
      })

      // 将计算结果存入Redis并返回
      webTotalWords = await setKey("webTotalWords", totalLength.toString())
    }

    return res.result(
      {
        // 网站文章总数
        webTotalPages,
        // 网站用户数
        webUserCounts,
        // 网站访客数
        touristCounts,
        // 网站总人数
        webTotalPersonCounts,
        // 网站创建时间
        webCreatedAt,
        // 文章最后更新时间
        webUpdatedAt,
        // Words统计
        webTotalWords,
      },
      "查询网站咨询成功~"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询网站咨询失败~", false)
    )
  }
})
export default router
