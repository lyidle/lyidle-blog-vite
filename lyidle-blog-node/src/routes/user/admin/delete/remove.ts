// 引入类型
import type { Request, Response } from "express"
// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入 清除 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除 文章缓存的函数
import { resetArticle } from "@/utils/redis/resetArticle"
// 引入时间转换
const ms = require("ms")
const { User, Article, Role } = require("@/db/models")

// 软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (findUser: any, articles: any[]) => {
  // 删除对应用户信息缓存
  await resetUserInfo([findUser])
  // 删除 对应的 文章的缓存
  await resetArticle(articles)
  // 删除用户的临时垃圾桶变量
  await delKey(`userArticleBin`)
  // 删除文章的缓存
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)
}
// 彻底删除函数
const deleted = async (findUser: any, articles: any[]) => {
  // 删除用户
  await findUser.destroy({ force: true })
  // 删除文章 和 权限等信息 会 自动删除
  // 删除时用户数量-1
  const userCounts = await getKey("userCounts")
  let num = +userCounts - 1
  // 越界判断
  if (num < 0) {
    num = 0
    console.warn("删除用户时,redis的缓存出现负数的情况哦~")
  }

  // 设置用户数量
  await setKey("userCounts", +userCounts - 1)
  // 删除临时的userBin
  await delKey(`userBin:${findUser.dataValues.id}`)

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
        attributes: ["id", "author"],
      },
      {
        model: Role,
        paranoid: false,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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

  if (!id) return res.result(void 0, "删除用户时，没有找到用户哦~", false)

  // 查找是否有用户
  const findUser = await findUserByPk(id)
  // 没有找到用户
  if (!findUser) return res.result(void 0, "删除用户时，没有找到用户哦~", false)

  // 找到提取需要的信息
  const { id: userId } = findUser.dataValues

  // 得到 对应的文章
  const articles = JSON.parse(JSON.stringify(findUser)).articles

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是用户的用户
    if (req.auth.id !== userId) {
      return res.result(void 0, "删除用户时，不能删除他人的用户哦~", false)
    }
  }

  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userBin:${userId}`)
    if (isBin)
      return res.result(void 0, "用户移动到垃圾桶了，请勿重复操作~", false)

    // 软删除
    await findUser.destroy()

    await setKey(`userBin:${userId}`, true)

    // 不管是否是软删除都要移除的
    await publicUserRemove(findUser, articles)

    return res.result(delete_user_expire, "用户成功移动到回收站~")
  }

  // 彻底删除
  await deleted(findUser, articles)
  return res.result(void 0, "删除用户成功~")
}
export default remove
