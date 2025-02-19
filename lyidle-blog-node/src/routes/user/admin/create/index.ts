import express from "express"
// 引入 redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
// 引入 创建用户和权限 权限没有时才创建
import { createUserWithRoles } from "@/utils/db/user/createUserWithRoles"
const router = express.Router()

// 普通用户组
const default_user = process.env.default_user!

// 注册接口
router.post("/", async (req, res, next) => {
  const {
    account: userAccount,
    nickName: userNickName,
    email: userEmail,
    password,
  } = req.body
  // 去除左右空格
  const account = userAccount.trim()
  const nickName = userNickName.trim()
  const email = userEmail.trim()

  try {
    const user = {
      account,
      nickName,
      pwd: password,
      email,
    }

    const result = await createUserWithRoles(user, [default_user])

    // 注册成功后删除缓存
    await delKey(`regCode:${email}`)
    // 注册成功用户数+1
    const userCounts = await getKey("userCounts")
    await setKey("userCounts", +userCounts + 1)
    return res.result(result, "创建用户成功~")
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "创建用户失败~", false)
    )
  }
})
export default router
