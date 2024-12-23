const { User, Article, UserInfo, Email } = require("@/db/models")
const ms = require("ms")
// 软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
// 彻底删除函数
const deleted = async (findUser: any, userId: number, email: string) => {
  // 删除文章
  await Article.destroy({ where: { userId } })
  // 删除 邮箱
  await Email.destroy({ where: { email } })
  // 删除 用户信息
  await UserInfo.destroy({ where: { userId } })
  // 删除用户
  await findUser.destroy()
}
// 删除函数await
const remove = async (req: any, res: any, bin: boolean = false) => {
  const { id, account } = req.body
  const commend: any = {
    attributes: ["email", "id"],
  }
  if (!(id || account)) return res.result(void 0, "没有找到用户哦~", false)
  // 按照account删除
  if (account)
    commend.where = {
      account,
    }
  // 按照id删除
  if (id)
    commend.where = {
      id: id,
    }
  // 查找是否有用户 以及得到邮箱
  const findUser = await User.findOne(commend)
  // 没有找到用户
  if (!findUser) return res.result(void 0, "没有找到用户哦~", false, 404)
  const { email, id: userId } = findUser.dataValues
  if (bin) {
    const data = { deleteAt: new Date() + delete_user_expire }
    await findUser.update(data, { where: { id: userId } })
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 彻底删除
      await deleted(findUser, userId, email)
      clearTimeout(tim as NodeJS.Timeout)
      tim = null
    }, delete_user_expire)
    return res.result(void 0, "软删除用户成功~")
  }
  // 彻底删除
  await deleted(findUser, userId, email)
  return res.result(void 0, "彻底删除用户成功~")
}
export default remove
