import { request } from "express"
// 引入redis
import { setkey } from "@/utils/redis"
// 引入时间转换
const ms = require("ms")
// 设置 token
const jwt = require("jsonwebtoken")
// token过期时间
const token_expire = ms(process.env.token_expire)
export const setToken = async (userInfo: typeof request.auth) => {
  // jwt.sign(数据, 加密字符串, 配置对象)
  const token = jwt.sign(userInfo, process.env.jwt_hash, {
    algorithm: "HS256",
    expiresIn: `${token_expire}`, //字符串单位是毫秒
  })
  // 得到 id
  const { id } = userInfo
  // 存储token到redis中
  await setkey(`token:${id}`, token, token_expire)
  return token
}
