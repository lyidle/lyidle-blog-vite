import express from "express"
// 引入api
// 发送注册邮箱
import email from "@/routes/email/reg"
// 引入 redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
// 正则判断
import { codeReg } from "@/RegExp/loginOrReg"
import { createUserWithRoles } from "@/utils/db/user/createUserWithRoles"
const router = express.Router()

// 普通用户组
const default_user = JSON.parse(process.env.default_user!)

// 注册接口
router.post("/", async (req, res, next) => {
  const {
    account: userAccount,
    nickName: userNickName,
    email: userEmail,
    code,
    password,
    confirmPassword,
  } = req.body
  // 去除左右空格
  const account = userAccount.trim()
  const nickName = userNickName.trim()
  const email = userEmail.trim()
  // 密码与确认密码不一致
  if (password !== confirmPassword)
    return res.result(void 0, "账号与密码不一致~", false)
  const { reg: codeRef, msg: codeMsg } = codeReg
  // 验证码不合格
  if (!codeRef.test(code)) {
    return res.result(void 0, codeMsg, false)
  }
  try {
    const findRegEmail = await getKey(`regCode:${email}`)
    // 判断有无找到
    if (findRegEmail === null) {
      return res.result(void 0, "请重新发送验证码~", false)
    }
    const { regCode: findCode } = findRegEmail
    // 判断验证码是否符合
    if (findCode != code) {
      return res.result(void 0, "验证码不正确~", false)
    }

    const user = {
      account,
      nickName,
      pwd: password,
      email,
    }

    const result = await createUserWithRoles(user, default_user)

    // 注册成功后删除缓存
    await delKey(`regCode:${email}`)
    // 注册成功用户数+1
    const userCounts = await getKey("userCounts")
    await setKey("userCounts", +userCounts + 1)
    return res.result(result, "注册成功~")
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "注册失败~", false)
    )
  }
})
// 邮箱发送接口
router.use(email)
export default router
