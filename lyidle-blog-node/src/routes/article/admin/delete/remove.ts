// 引入redis
import { delKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")

// 软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
// 引入模型
const { Article, User, Role, Report, sequelize } = require("@/db/models")

// 引入 重置user的缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除 article 的缓存的函数
import { resetArticle } from "@/utils/redis/resetArticle"

// 不管是否删除都要移除的 定时任务 也需要
export const publicArticleRemove = async (articles: any[]) => {
  const results = await Promise.allSettled([
    // 删除对应用户信息缓存
    ...JSON.parse(JSON.stringify(articles))?.map((item: any) =>
      resetUserInfo([item.User])
    ),
    // 删除对应的文章缓存
    resetArticle([articles]),
    // 删除文章的缓存
    delKey(`webTotalPages`),
    delKey(`webTotalWords`),
  ])
  // 检查是否有任务失败
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("删除文章失败:", result.reason)
    }
  })
}

// 彻底删除函数
const deleted = async (model: any) => {
  // 开启事务确保数据一致性
  const transaction = await sequelize.transaction()
  try {
    // 1. 先删除关联的举报记录（如果有）
    await Report.destroy({
      where: { articleId: model.id },
      transaction,
    })
    // 删除文章
    await model.destroy({ force: true, transaction })
    // 提交事务
    await transaction.commit()
    await publicArticleRemove([model])
  } catch (error) {
    // 回滚事务
    await transaction.rollback()
    throw new Error("彻底删除文章失败")
  }
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

  // 找到提取需要的信息
  const { userId } = findArticle.dataValues

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是用户的文章
    if (req.auth.id !== userId) {
      return res.result(void 0, "删除文章时，不能删除他人的文章", false)
    }
  }

  // 回收到垃圾桶
  if (bin) {
    // 软删除
    await findArticle.destroy()

    // 不管是否是软删除都要移除的
    await publicArticleRemove([findArticle])
    // 到时间自动删除 使用定时任务 每天判断
    return res.result(delete_article_expire, "文章成功移到回收站~")
  }

  // 彻底删除
  await deleted(findArticle)
  return res.result(void 0, "删除文章成功~")
}
export default remove
