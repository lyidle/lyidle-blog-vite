import { request } from "express"
// 设置 token
const jwt = require("jsonwebtoken")
export default (userInfo: typeof request.auth) => {
  // jwt.sign(数据, 加密字符串, 配置对象)
  return jwt.sign(userInfo, process.env.HASH, {
    algorithm: "HS256",
    expiresIn: process.env.TOKEN_EXPIRE, //单位是 秒
  })
}
