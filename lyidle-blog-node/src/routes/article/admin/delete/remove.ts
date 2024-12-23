// 引入查找文章的函数
import findArticleFn from "@/routes/article/admin/find"
const ms = require("ms")
// 软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
// 彻底删除函数
const deleted = async (Article: any) => {
  // 删除文章
  await Article.destroy()
}
// 删除函数
const remove = async (req: any, res: any, bin: boolean = false) => {
  const findArticles = await findArticleFn(req, res)
  // 没找到返回
  if (!findArticles?.findArticle) return
  // 找到提取
  const { id, findArticle } = findArticles
  if (bin) {
    const data = { deleteAt: new Date() + delete_article_expire }
    await findArticle.update(data, { where: { id } })
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 彻底删除
      await deleted(findArticle)
      clearTimeout(tim as NodeJS.Timeout)
      tim = null
    }, delete_article_expire)
    return res.result(void 0, "软删除文章成功~")
  }
  // 彻底删除
  await deleted(findArticle)
  return res.result(void 0, "彻底删除文章成功~")
}
export default remove
