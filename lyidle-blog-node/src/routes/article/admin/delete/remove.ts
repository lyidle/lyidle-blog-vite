const { Article } = require("@/db/models")
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
  const { id } = req.body
  const commend: any = {}
  if (!id) return res.result(void 0, "没有找到文章哦~", false, 400)
  // 按照id删除
  if (id)
    commend.where = {
      id: id,
    }
  // 查找是否有文章 以及得到邮箱
  const findArticle = await Article.findOne(commend)
  // 没有找到文章
  if (!findArticle) return res.result(void 0, "没有找到文章哦~", false, 404)
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
