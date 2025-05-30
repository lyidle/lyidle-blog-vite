// 引入类型
import type { Request, Response } from "express"
// 引入redis
import { delKey } from "@/utils/redis"
// 引入 清除 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除 文章缓存的函数
import { resetArticle } from "@/utils/redis/resetArticle"
// 引入时间转换
const ms = require("ms")
const { User, Article, Role } = require("@/db/models")

// 软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
const default_owner = process.env.default_owner!
// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (findUser: any, articles: any[]) => {
  // 删除对应用户信息缓存
  await resetUserInfo([findUser])
  // 删除 对应的 文章的缓存
  await resetArticle(articles, true)
  // 删除文章的缓存
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)
}
// 彻底删除函数
const deleted = async (findUser: any, articles: any[]) => {
  // 删除用户
  await findUser.destroy({ force: true })
  // 不管是否删除都要移除的
  await publicUserRemove(findUser, articles)
}

// 通过 id查询用户
const findUserByPk = async (id: number) => {
  return await User.findByPk(id, {
    paranoid: false,
    include: [
      {
        model: Article,
        as: "articles",
        attributes: { exclude: ["content"] },
      },
      {
        model: Role,
        paranoid: false,
        attributes: ["name"],
        through: { attributes: [] },
      },
    ],
  })
}

// 删除函数await
const remove = async (
  req: Request,
  res: Response,
  _id: number | null = null,
  bin: boolean = false,
  isAuth = true
) => {
  let { id } = req.body
  if (_id) id = _id

  if (!id) return res.result(void 0, "删除用户时，没有找到用户", false)

  // 查找是否有用户
  const findUser = await findUserByPk(id)
  // 没有找到用户
  if (!findUser) return res.result(void 0, "删除用户时，没有找到用户", false)

  // 找到提取需要的信息
  const { id: userId } = findUser.dataValues

  // 得到 对应的文章
  const articles = JSON.parse(JSON.stringify(findUser)).articles

  if (
    JSON.parse(JSON.stringify(findUser))?.Roles?.some(
      (item) => item.name === default_owner
    )
  ) {
    return res.result(void 0, "删除用户时，不能权限为owner的用户", false)
  }

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是用户的用户
    if (req.auth.id !== userId) {
      return res.result(void 0, "删除用户时，不能删除他人的用户", false)
    }
  }

  if (bin) {
    // 软删除
    await findUser.destroy()
    // 不管是否是软删除都要移除的
    await publicUserRemove(findUser, articles)

    return res.result(delete_user_expire, "用户成功移动到回收站~")
  }

  // 彻底删除
  await deleted(findUser, articles)
  return res.result(void 0, "删除用户成功~")
}
export default remove
