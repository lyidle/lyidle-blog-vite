import express from "express"
// 设置token
import setToken from "@/utils/setToken"
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
const { User } = require("@/db/models")
const router = express.Router()
router.put("/", async (req, res, next) => {
  try {
    const { id, account, pwd, email, avater, signer, nickName, role, status } =
      req.body
    const commend: any = {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    }
    // 设置权重 查询用户
    if (account) commend.where = { account }
    if (id) commend.where = { id }

    const findUser = await User.findOne(commend)
    // 判断有无找到用户
    if (!findUser) return res.result(void 0, "没有找到对应用户信息~", false)
    // 提取需要的变量
    const {
      id: userId,
      account: userAccount,
      avater: userAvatar,
      signer: userSigner,
      role: userRole,
      nickName: userNickName,
      email: userEmail,
      status: userStatus,
    } = findUser.dataValues

    // 提取变量 可以直接放入的
    const result: any = { avater, signer, nickName }
    // 整理数据
    // 判断有无值
    if (pwd) result.pwd = bcrypt.hashSync(pwd, 10) // 使用传入的 pwd 进行加密

    // 去重并存储
    if (role && Array.isArray(role))
      result.role = [...new Set([...role, ...userRole])]

    // 判断账号是否重复
    if (account) {
      // 判断是否重复
      if (account == userAccount)
        return res.result(void 0, "账号不能和旧的账号重复~", false)
      // 查询是否重名
      const findAccount = await User.findOne({ where: { account } })
      if (findAccount) return res.result(void 0, "账号名重复了~", false)
      // 都通过加入更新
      result.account = account
    }

    // 判断邮箱是否重复
    if (email) {
      // 判断是否重复
      if (email == userEmail)
        return res.result(void 0, "邮箱不能和旧的邮箱重复~", false)
      // 查询是否重名
      const findEmail = await User.findOne({ where: { email } })
      if (findEmail) return res.result(void 0, "邮箱重复了~", false)
      // 都通过加入更新
      result.email = email
    }
    result.status = status ?? userStatus
    // 整理token
    const setTokenData = {
      id: id ? id : userId,
      account: account ? account : userAccount,
      avater: avater ? avater : userAvatar,
      signer: signer ? signer : userSigner,
      role: role ? role : userRole,
      nickName: nickName ? nickName : userNickName,
      status: status ?? userStatus,
    }
    // 设置token
    const token = setToken(setTokenData)
    result.token = token
    // 整理完毕更新
    await findUser.update(result, {})
    return res.result({ token, userInfo: setTokenData }, "修改用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "修改用户信息失败~", false)
    )
  }
})
export default router
