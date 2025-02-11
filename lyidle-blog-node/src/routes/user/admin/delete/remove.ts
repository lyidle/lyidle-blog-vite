// 引入类型
import type { Request, Response } from "express"
// 引入redis
import { delKey, setKey, getKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")
const { User, Article } = require("@/db/models")
// 软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
// 不管是否删除都要移除的 定时任务 也需要
export const publicUserRemove = async (userId: number) => {
  // 删除用户信息缓存
  await delKey(`token:${userId}`)
  await delKey(`userInfo:${userId}`)

  // 删除用户的缓存
  await delKey(`userArticleBin`)
  await delKey(`webTotalPages`)
  await delKey(`webTotalWords`)
}
// 彻底删除函数
const deleted = async (findUser: any, userId: number, email: string) => {
  // 删除用户
  await Article.destroy({ where: { userId } })
  // 删除用户
  await findUser.destroy()
  // 删除时用户数量-1
  const userCounts = await getKey("userCounts")
  let num = +userCounts - 1
  // 越界判断
  if (num < 0) num = 0
  // 设置用户数量
  await setKey("userCounts", +userCounts - 1)
  // 删除临时的userBin
  await delKey(`userBin:${userId}`)

  // 不管是否删除都要移除的
  await publicUserRemove(userId)
}

// 删除函数await
const remove = async (
  req: Request,
  res: Response,
  bin: boolean = false,
  isAuth = true
) => {
  const { id } = req.body

  // 查找是否有用户
  const findUser = await User.findByPk(id)
  // 没有找到用户
  if (!findUser) return res.result(void 0, "删除用户时，没有找到用户哦~", false)

  // 找到提取需要的信息
  const { id: userId, email } = findUser.dataValues

  // 是否 权限 判断
  if (isAuth) {
    // 判断是否是用户的用户
    if (req.auth.id !== userId) {
      return res.result(void 0, "删除用户时，不能删除他人的用户哦~", false)
    }
  }

  // 不管是否删除都要移除的
  await publicUserRemove(userId)

  if (bin) {
    // 只能点击移动到一次垃圾桶
    const isBin = await getKey(`userBin:${userId}`)
    if (isBin)
      return res.result(void 0, "用户移动到垃圾桶了，请勿重复操作~", false)

    // 设置数据
    findUser.set("isBin", Date.now() + delete_user_expire)
    // 更新
    await findUser.save()

    await setKey(`userBin:${userId}`, true)

    return res.result(void 0, "用户成功移动到回收站~")
  }

  // 彻底删除
  await deleted(findUser, userId, email)
  return res.result(void 0, "删除用户成功~")
}
export default remove
