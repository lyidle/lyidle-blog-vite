import express from "express"
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
      await setKey("touristCounts", touristCounts)
    }

    // 查询用户数量
    let webUserCounts = await getKey("userCounts")

    if (webUserCounts === null) {
      // 得到 用户数量
      webUserCounts = await User.count()
      await setKey("userCounts", webUserCounts)
    }

    // 总访问量
    const webTotalPersonCounts = +webUserCounts + +touristCounts

    // 网页总数
    let webTotalPages = await getKey("webTotalPages")
    if (webTotalPages === null) {
      webTotalPages = await Article.count()
      await setKey("webTotalPages", webTotalPages)
    }

    // 最后更新时间
    let webUpdatedAt = await getKey("webUpdatedAt")
    if (webUpdatedAt === null)
      webUpdatedAt = await setKey("webUpdatedAt", new Date())

    // 获取字数
    let webTotalWords = await getKey("webTotalWords")
    if (webTotalWords === null) {
      const Articles = await Article.findAll({ attributes: ["length"] })
      let length = 0
      JSON.parse(JSON.stringify(Articles)).forEach((item: any) => {
        length += item.length
      })
      webTotalWords = await setKey("totalWords", length)
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
