// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")

// 软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
// 引入模型
const { Article, User, Role } = require("@/db/models")

// 引入 重置user的缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除 article 的缓存的函数
import { resetArticle } from "@/utils/redis/resetArticle"

// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (articles: any[], user: any) => {
  // 删除对应用户信息缓存
  await resetUserInfo([user])
  // 删除 对应的文章缓存
  await resetArticle([articles])
  // 删除文章的缓存
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)
}

// 彻底删除函数
const deleted = async (model: any, id: number, articles: any[], user: any) => {
  // 删除文章
  await model.destroy({ force: true })
  // 删除临时的 userArticleBin
  await delKey(`userArticleBin:${id}`)
  // 不管是否删除都要移除的
  await publicUserRemove(articles, user)
}
// 删除函数
const remove = async (
  req: any,
  res: any,
  bin: boolean = false,
  isAuth = true
) => {
  const { id: articleId } = req.body

  if (!articleId) return res.result(void 0, "删除文章时，没有找到文章", false)

  // 查找是否有文章
  const findArticle = await Article.findByPk(articleId, {
    paranoid: false,
    attributes: { exclude: ["content"] },
    include: [
      {
        model: User,
        paranoid: false,
        attributes: ["id", "account"],
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"],
          },
        ],
      },
    ],
  })
  // 没有找到文章
  if (!findArticle) return res.result(void 0, "删除文章时，没有找到文章", false)
  // 得到 user
  const user = JSON.parse(JSON.stringify(findArticle)).User

  // 找到提取需要的信息
  const { id, userId } = findArticle.dataValues

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是用户的文章
    if (req.auth.id !== userId) {
      return res.result(void 0, "删除文章时，不能删除他人的文章", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userArticleBin:${id}`)
    if (isBin)
      return res.result(void 0, "文章移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findArticle.destroy()
    // 设置缓存
    await setKey(`userArticleBin:${id}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove([findArticle], user)
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_article_expire, "文章成功移到回收站~")
  }

  // 彻底删除
  await deleted(findArticle, id, [findArticle], user)
  return res.result(void 0, "删除文章成功~")
}
export default remove
