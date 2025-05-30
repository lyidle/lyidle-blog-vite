import { setKey, getKey } from "@/utils/redis"
import { readFileSync } from "fs"
import { join } from "path"
// 引入 big.js
import Big from "big.js"
// 敏感词构造器
const filterWords = require("@/utils/db/filter")

// 引入模型
const { User, Article, Setting, Visitor, Role, Filter } = require("@/db/models")

const is_production = JSON.parse(process.env.is_production!)
const default_owner = process.env.default_owner
export default async () => {
  let ownerId = await getKey("ownerId")
  if (!ownerId) {
    const findUser = await User.findOne({
      attributes: ["id"],
      include: [
        {
          model: Role,
          attributes: ["id"],
          through: { attributes: [] },
          where: { name: default_owner },
          required: true,
        },
      ],
    })
    if (!findUser) throw new Error("没有初始化owner账户")
    ownerId = findUser.id
    await setKey("ownerId", ownerId)
  }
  // 并行执行所有初始化任务
  const results = await Promise.allSettled([
    // 初始化敏感词
    (async () => {
      // 判断 是否有缓存
      const cacheKey = "filters"
      const cacheValue = await getKey(cacheKey)
      if (cacheValue) {
        filterWords.init(cacheValue)
        return
      }

      // 得到 敏感词库
      const filters = await Filter.findAll({ raw: true })
      const words = filters?.map((item) => item?.word)
      filterWords.init(words)
      await setKey(cacheKey, words)
    })(),
    // 初始化 创站时间
    (async () => {
      const webCreatedAt = await getKey("webCreatedAt")
      if (webCreatedAt === null) await setKey("webCreatedAt", new Date())
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
        await setKey("webUpdatedAt", dataValues.updatedAt || new Date())
      }
    })(),

    // 初始化 访客数
    (async () => {
      let touristCounts = await getKey("touristCounts")
      if (touristCounts === null) {
        touristCounts = await Visitor.count()
        await setKey("touristCounts", `${touristCounts}`)
      }
    })(),

    // 初始化 用户数
    (async () => {
      const userCounts = await getKey("userCounts")
      if (userCounts === null) {
        const userCount = await User.count()
        await setKey("userCounts", `${userCount}`)
      }
    })(),

    // 初始化 文章总数
    (async () => {
      const webTotalPages = await getKey("webTotalPages")
      if (webTotalPages === null) {
        const articleCount = await Article.count()
        await setKey("webTotalPages", `${articleCount}`)
      }
    })(),

    // 初始化 网站文章总字数
    (async () => {
      const webTotalWords = await getKey("webTotalWords")
      if (webTotalWords === null) {
        // 查询所有文章的字数
        const Articles = await Article.findAll({ attributes: ["length"] })

        // 使用Big.js初始化总字数
        let totalLength = new Big(0)

        // 遍历所有文章累加字数
        JSON.parse(JSON.stringify(Articles)).forEach((item) => {
          totalLength = totalLength.plus(new Big(item.length || 0))
        })

        // 将计算结果存入Redis
        await setKey("webTotalWords", totalLength.toString())
      }
    })(),

    // 初始化 公告
    (async () => {
      const announce = await getKey("setting:公告")
      if (announce === null) {
        const [dataValues] = await Setting.findOrCreate({
          where: {
            name: "公告",
          },
          defaults: {
            name: "公告",
            userId: ownerId,
            content: is_production
              ? ""
              : "公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
          },
        })
        await setKey("setting:公告", dataValues)
      }
    })(),

    // 初始化 版权
    (async () => {
      const copyright = await getKey("setting:版权")
      if (copyright === null) {
        const [dataValues] = await Setting.findOrCreate({
          where: {
            name: "版权",
          },
          defaults: {
            name: "版权",
            userId: ownerId,
            content: is_production ? "© Lyのblog" : "©2024-2025",
          },
        })
        await setKey("setting:版权", dataValues)
      }
    })(),

    // 初始化 联系方式
    (async () => {
      const follow = await getKey("setting:联系方式")
      if (follow === null) {
        const [dataValues] = await Setting.findOrCreate({
          where: {
            name: "联系方式",
          },
          defaults: {
            name: "联系方式",
            userId: ownerId,
            content: {
              weChat: "LIDSGOA",
              QQ: "912512766",
              BiliBili:
                "https://space.bilibili.com/238728646?spm_id_from=333.1007.0.0",
              email: "912512766@qq.com",
            },
          },
        })
        await setKey("setting:联系方式", dataValues)
      }
    })(),

    // 初始化 关于
    (async () => {
      const aboutMd = readFileSync(
        join(__dirname, "../db/mock/about.txt"),
        "utf8"
      )
      const about = await getKey("setting:关于")
      if (about === null) {
        const [dataValues] = await Setting.findOrCreate({
          where: {
            name: "关于",
          },
          defaults: {
            name: "关于",
            userId: ownerId,
            content: aboutMd,
            link: "/person/about",
          },
        })
        await setKey("setting:关于", dataValues)
      }
    })(),
    (async () => {
      const note = await getKey("setting:笔记菜单项")
      if (note === null) {
        const [dataValues] = await Setting.findOrCreate({
          where: {
            name: "笔记菜单项",
          },
          defaults: {
            name: "笔记菜单项",
            userId: ownerId,
            content: ["前端", "后端"],
          },
        })
        await setKey("setting:笔记菜单项", dataValues)
      }
    })(),
  ])

  // 检查是否有任务失败
  const errList = results
    .map((result) => result.status === "rejected" && result.reason)
    .filter(Boolean)
    .join("\n")
  if (errList) throw new Error("初始化网站任务失败:\n" + errList)
}
