import { setKey, getKey } from "@/utils/redis"
import { readFileSync } from "fs"
import { join } from "path"

// 引入模型
const { User, Article, Setting, Visitor } = require("@/db/models")
const is_production = JSON.parse(process.env.is_production!)

export default async () => {
  // 并行执行所有初始化任务
  const results = await Promise.allSettled([
    // 初始化 创站时间
    (async () => {
      const webCreatedAt = await getKey("webCreatedAt")
      if (webCreatedAt === null) await setKey("webCreatedAt", new Date())
    })(),

    // 初始化 访客数
    (async () => {
      let touristCounts = +(await getKey("touristCounts"))
      if (touristCounts === null) {
        touristCounts = await Visitor.count()
        await setKey("touristCounts", touristCounts)
      }
    })(),

    // 初始化 用户数
    (async () => {
      const userCounts = await getKey("userCounts")
      if (userCounts === null) {
        const userCount = await User.count()
        await setKey("userCounts", userCount)
      }
    })(),

    // 初始化 网站文章最后更新时间
    (async () => {
      const webUpdatedAt = await getKey("webUpdatedAt")
      if (webUpdatedAt === null) {
        const { dataValues } = await Article.findOne({
          attributes: ["updatedAt"],
          order: [
            ["updatedAt", "desc"],
            ["id", "desc"],
          ],
          limit: 1,
        })
        await setKey("webUpdatedAt", dataValues.updatedAt)
      }
    })(),

    // 初始化 文章总数
    (async () => {
      const webTotalPages = await getKey("webTotalPages")
      if (webTotalPages === null) {
        const articleCount = await Article.count()
        await setKey("webTotalPages", articleCount)
      }
    })(),

    // 初始化 网站文章总字数
    (async () => {
      const totalWords = await getKey("totalWords")
      if (totalWords === null) {
        const Articles = await Article.findAll({ attributes: ["length"] })
        let length = 0
        JSON.parse(JSON.stringify(Articles)).forEach((item: any) => {
          length += item.length
        })
        await setKey("totalWords", length)
      }
    })(),

    // 初始化 公告
    (async () => {
      const announce = await getKey("setting:公告")
      if (announce === null) {
        const { dataValues } = await Setting.create({
          name: "公告",
          content: is_production
            ? ""
            : "公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
        })
        await setKey("setting:公告", dataValues)
      }
    })(),

    // 初始化 版权
    (async () => {
      const copyright = await getKey("setting:版权")
      if (copyright === null) {
        const { dataValues } = await Setting.create({
          name: "版权",
          content: is_production ? "" : "©2024-2025",
        })
        await setKey("setting:版权", dataValues)
      }
    })(),

    // 初始化 联系方式
    (async () => {
      const follow = await getKey("setting:联系方式")
      if (follow === null) {
        const { dataValues } = await Setting.create({
          name: "联系方式",
          content: {
            weChat: "LIDSGOA",
            QQ: "912512766",
            BiliBili:
              "https://space.bilibili.com/238728646?spm_id_from=333.1007.0.0",
            email: "912512766@qq.com",
          },
        })
        await setKey("setting:联系方式", dataValues)
      }
    })(),

    // 初始化 关于
    (async () => {
      const aboutMd = readFileSync(
        join(__dirname, "../db/mock/about.md"),
        "utf8"
      )
      const about = await getKey("setting:关于")
      if (about === null) {
        const { dataValues } = await Setting.create({
          name: "关于",
          content: aboutMd,
        })
        await setKey("setting:关于", dataValues)
      }
    })(),
  ])

  // 检查是否有任务失败
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("初始化网站任务失败:", result.reason)
    }
  })
}
