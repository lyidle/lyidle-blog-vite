// 引入查找文章的函数
import findArticleFn from "@/routes/article/admin/find"
// 引入类型
import type { TimeValue } from "@/utils/moment"
// 引入moment
import { convert } from "@/utils/moment"
// 软删除文章的时间
const delete_article_expire = convert(
  process.env.delete_article_expire as TimeValue
)
// 彻底删除函数
const deleted = async (Article: any) => {
  // 删除文章
  await Article.destroy()
}
// 引入模型
const { Article } = require("@/db/models")
// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const findArticles = await findArticleFn(req, res)
  // 没找到返回
  if (!findArticles?.findArticle) return
  // 找到提取
  const { id, findArticle } = findArticles
  if (bin) {
    const data = { status: 1 }
    await findArticle.update(data, { where: { id } })
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 查询是否真的移除用户
      const result = await Article.findByPk(id)
      if (result.dataValues.status) {
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
