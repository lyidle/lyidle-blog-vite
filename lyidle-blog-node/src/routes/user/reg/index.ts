import express from "express"
// 引入api
// 发送注册邮箱
import email from "@/routes/email/reg"
// 引入 redis 设置缓存
import { getKey, delKey } from "@/utils/redis"
// 正则判断
import { codeReg } from "@/RegExp/loginOrReg"
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
    code,
    password,
    confirmPassword,
  } = req.body
  // 去除左右空格
  const account = userAccount?.trim()
  const nickName = userNickName?.trim()
  const email = userEmail?.trim()
  // 密码与确认密码不一致
  if (password !== confirmPassword)
    return res.result(void 0, "账号与密码不一致~", false)
  const { reg: _codeReg, msg: codeMsg } = codeReg
  // 验证码不合格
  if (!_codeReg.test(code)) {
    return res.result(void 0, codeMsg, false)
  }
  // 得到 code
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
  try {
    const user = {
      account,
      nickName,
      pwd: password,
      email,
    }

    // 创建 用户
    const result = await createUserWithRoles(user, [default_user])

    // 注册成功后删除缓存
    await delKey(`regCode:${email}`)
    return res.result(result, "注册成功~")
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "注册失败~", false)
    )
  }
})
// 邮箱发送接口
router.use("/", email)
export default router
