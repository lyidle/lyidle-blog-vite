// 引入错误函数
import myError from "@/utils/Error"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")
const { User, Article } = require("@/db/models")
// 软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
// 彻底删除函数
const deleted = async (findUser: any, userId: number, email: string) => {
  // 删除文章
  await Article.destroy({ where: { userId } })
  // 删除用户
  await findUser.destroy()
  // 删除时用户数量-1
  const userCounts = await getKey("userCounts")
  await setKey("userCounts", +userCounts - 1)
  // 删除临时的userBin
  await delKey(`userBin:${userId}`)
}

// 删除函数await
const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
  bin: boolean = false
) => {
  // const { id, account } = req.body
  const commend: any = {
    attributes: ["email", "id"],
    where: { id: req.auth.id },
  }
  // if (!(id || account)) return res.result(void 0, "没有找到用户哦~", false)
  // // 按照account删除
  // if (account)
  //   commend.where = {
  //     account,
  //   }
  // // 按照id删除
  // if (id)
  //   commend.where = {
  //     id: id,
  //   }
  // 查找是否有用户 以及得到邮箱
  const findUser = await User.findOne(commend)
  // 没有找到用户
  if (!findUser) return res.result(void 0, "没有找到用户哦~", false, 404)

  // 判断是否是该用户
  if (req.auth.id !== findUser.dataValues.id) {
    next(new myError("PermissionError"))
    return
  }

  // 提取需要的信息
  const { email, id: userId } = findUser.dataValues

  // 删除用户信息缓存
  await delKey(`token:${userId}`)
  await delKey(`userInfo:${userId}`)
  // 删除文章的缓存
  await delKey(`userArticleBin`)
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)

  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userBin:${userId}`)
    if (isBin) return res.result(void 0, "请勿重复操作~", false)

    const data = { isBin: 1 }
    await findUser.update(data, { where: { id: userId } })
    await setKey(`userBin:${userId}`, true)
    // 到时间自动删除
    let tim: NodeJS.Timeout | null = setTimeout(async () => {
      // 查询是否真的移除用户
      const result = await User.findByPk(userId)
      // 判断是否真的删除了
      if (result.dataValues.isBin) {
        // 彻底删除
        await deleted(findUser, userId, email)
      }
      clearTimeout(tim as NodeJS.Timeout)
      tim = null
    }, delete_user_expire)
    return res.result(void 0, "用户成功移动到回收站~")
  }

  // 彻底删除
  await deleted(findUser, userId, email)
  return res.result(void 0, "删除用户成功~")
}
export default remove
