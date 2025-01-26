// 引入查找文章的函数
import findArticleFn from "@/routes/article/admin/find"
// 引入error 函数
import myError from "@/utils/Error"
// 引入类型
import type { NextFunction } from "express"
// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")
// 软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
// 引入模型
const { Article } = require("@/db/models")
// 彻底删除函数
const deleted = async (delArticle: any, id: number | string) => {
  // 删除文章
  await delArticle.destroy()
  // 删除临时的 userArticleBin
  await delKey(`userArticleBin`)
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
  const userId = findArticle.dataValues.userId
  // 判断是否是用户的文章
  if (req.auth.id !== userId) {
    next(new myError("PermissionError"))
    return
  }

  // 删除用户信息缓存
  await delKey(`userInfo:${userId}`)
  // 删除文章的缓存
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)

  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userArticleBin:${id}`)
    if (isBin) return res.result(void 0, "请勿重复操作~", false)

    const data = { isBin: 1 }
    await findArticle.update(data, { where: { id } })
    await setKey(`userArticleBin:${id}`, true)
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 删除临时的userArticleBin
      await delKey(`userArticleBin:${id}`)
      // 查询是否真的移除用户
      const result = await Article.findByPk(id)
      if (result.dataValues.isBin) {
        // 彻底删除
        await deleted(findArticle, id)
      }
      clearTimeout(tim as NodeJS.Timeout)
      tim = null
    }, delete_article_expire)
    return res.result(void 0, "文章成功移到回收站~")
  }
  // 彻底删除
  await deleted(findArticle, id)
  return res.result(void 0, "删除文章成功~")
}
export default remove
