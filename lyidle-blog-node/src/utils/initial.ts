// 引入redis 设置缓存
const { setKey, getKey } = require("@/utils/redis")
// 引入模型
const { User, Article, Setting } = require("@/db/models")
const is_production = JSON.parse(process.env.is_production!)
export default async () => {
  // 初始化 创站时间
  const webCreatedAt = await getKey("webCreatedAt")
  if (webCreatedAt === null) await setKey("webCreatedAt", new Date())

  // 初始化 用户数
  const userCounts = await getKey("userCounts")
  if (userCounts === null) {
    // 得到 用户数量
    const userCount = await User.count()
    await setKey("userCounts", userCount)
  }

  // 初始化 网站文章最后更新时间
  const webUpdatedAt = await getKey("webUpdatedAt")
  if (webUpdatedAt === null) {
    const { dataValues } = await Article.findOne({
      attributes: ["updatedAt"],
      order: [["updatedAt", "desc"], [["id", "desc"]]],
      limit: 1,
    })
    await setKey("webUpdatedAt", dataValues.updatedAt)
  }

  // 初始化 文章总数
  const webTotalPages = await getKey("webTotalPages")
  if (webTotalPages === null) {
    const articleCount = await Article.count()
    await setKey("webTotalPages", articleCount)
  }

  // 初始化 网站文章总字数
  const totalWords = await getKey("totalWords")
  if (totalWords === null) {
    const Articles = await Article.findAll({ attributes: ["length"] })
    let length = 0
    JSON.parse(JSON.stringify(Articles)).forEach((item: any) => {
      length += item.length
    })
    await setKey("totalWords", length)
  }

  // 初始化 公告
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

  // 初始化 版权
  const copyright = await getKey("setting:版权")
  if (copyright === null) {
    const { dataValues } = await Setting.create({
      name: "版权",
      content: is_production ? "" : "©2022-2023",
    })
    await setKey("setting:版权", dataValues)
  }

  // 初始化 联系方式
  const follow = await getKey("setting:联系方式")
  if (follow === null) {
    const { dataValues } = await Setting.create({
      name: "联系方式",
      content: is_production
        ? ""
        : JSON.stringify({
            weChat: "LIDSGOA",
            QQ: "912512766",
            BiliBili: "BiliBili",
            email: "912512766@qq.com",
          }),
    })
    await setKey("setting:联系方式", dataValues)
  }
}
