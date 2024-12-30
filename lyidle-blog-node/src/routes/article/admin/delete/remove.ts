// 引入查找文章的函数
import findArticleFn from "@/routes/article/admin/find"
// 引入error 函数
import myError from "@/utils/Error"
// 引入类型
import type { NextFunction } from "express"
// 引入查询
import { Op } from "sequelize"
// 引入时间转换
const ms = require("ms")
// 软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
// 引入模型
const { UserInfo, Article } = require("@/db/models")
// 彻底删除函数
const deleted = async (delArticle: any) => {
  // 删除文章
  await delArticle.destroy()
  // 得到对应数据
  const {
    category,
    userInfoId,
    tags: delTags,
    userId,
    length,
  } = delArticle.dataValues
  // 找到UserInfo
  const findUserInfo = await UserInfo.findByPk(userInfoId)

  // 最终更新的 UserInfo信息
  const result: any = {}
  // 得到对应的tags和categories
  const {
    categories,
    tags,
    pages: userPages,
    totalWords,
  } = findUserInfo.dataValues

  // 处理pages
  result.pages = userPages - 1
  // 处理总字数
  result.totalWords = totalWords - length

  // 只有一篇则删除了userInfo也该去掉
  if (result.pages === 1) {
    // 删除userInfo
    await findUserInfo.destroy()
    return
  }

  // #region 处理category
  // 查找 文章中 是否还有对应的 category
  const { count } = await Article.findAndCountAll({
    where: { category },
    attribute: [],
  })
  // 没有找到更新userInfo 去掉这个分类保留剩下的
  if (!count) {
    // 去掉对应category
    result.categories = categories.filter((item: string) => item !== category)
  }
  // #endregion 处理category

  // #region 处理 tags
  // 查找 文章中 是否还有 tags
  // 先查找用户所有的tags
  const allTags = await Article.findAll({
    where: { tags: { [Op.not]: "[]" }, userId },
    attributes: ["tags"],
  })
  // 存储删除后还有的标签
  let deletedContains: Set<string> | null = new Set()
  // 遍历所有文章的标签
  for (let i = 0; i < allTags.length; i++) {
    const oneTags = allTags[i].dataValues
    // 单个文章中的一项标签
    for (let i = 0; i < oneTags.tags.length; i++) {
      const oneTag = oneTags.tags[i]
      // 包含需要删除的标签
      if (delTags.includes(oneTag)) deletedContains.add(oneTag)
    }
  }
  //  去除set 删除标签后还拥有的标签
  const getDeletedSet = [...deletedContains]
  // 处理结束清除set
  deletedContains.clear()
  deletedContains = null
  // 得到 删除后拥有的标签 和 需要删除的标签 的差集 即需要移除的标签集合
  const delDiff1 = getDeletedSet.filter(
    (item: string) => !delTags.includes(item)
  )
  const delDiff2 = delTags.filter(
    (item: string) => !getDeletedSet.includes(item)
  )
  // 需要移除的标签
  const delDiff = [...delDiff1, ...delDiff2]
  // 整理 需要的标签 排除 delDiff
  result.tags = tags.filter((item: string) => !delDiff.includes(item))
  // #endregion 处理 tags

  // 更新用户信息
  await findUserInfo.update(result)
}
// 删除函数
const remove = async (
  req: any,
  res: any,
  next: NextFunction,
  bin: boolean = false
) => {
  const findArticles = await findArticleFn(req, res)
  // 没找到返回
  if (!findArticles?.findArticle) return
  // 找到提取
  const { id, findArticle } = findArticles
  // 判断是否是用户的文章
  if (req.auth.id !== findArticle.dataValues.userId) {
    next(new myError("PermissionError"))
    return
  }
  if (bin) {
    const data = { isBin: 1 }
    await findArticle.update(data, { where: { id } })
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 查询是否真的移除用户
      const result = await Article.findByPk(id)
      if (result.dataValues.isBin) {
        // 彻底删除
        await deleted(findArticle)
      }
      clearTimeout(tim as NodeJS.Timeout)
      tim = null
    }, delete_article_expire)
    return res.result(void 0, "文章成功移到回收站~")
  }
  // 彻底删除
  await deleted(findArticle)
  return res.result(void 0, "删除文章成功~")
}
export default remove
