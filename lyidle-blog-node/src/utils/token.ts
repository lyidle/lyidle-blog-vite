import { request } from "express"
// 引入redis
import { setKey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")
// 设置 token
const jwt = require("jsonwebtoken")
// 自定义错误
import myError from "@/utils/error/myError"
// token过期时间
const token_expire = ms(process.env.token_expire)
export const setToken = async (userInfo: typeof request.auth) => {
  // 整理token
  let tokenData: Partial<typeof request.auth> = {}

  if (!Object.keys(userInfo).length) {
    throw new myError("otherError", "生成用户token时出错了")
  }

  tokenData.id = userInfo.id
  tokenData.account = userInfo.account
  tokenData.roles = userInfo.roles

  // jwt.sign(数据, 加密字符串, 配置对象)
  const token = jwt.sign(tokenData, process.env.jwt_hash, {
    algorithm: "HS256",
    expiresIn: `${token_expire}`, //字符串单位是毫秒
  })

  // 得到 id
  const { id } = userInfo
  // 存储token到redis中
  await setKey(`user:${id}:token`, token, token_expire)
  return token
}
