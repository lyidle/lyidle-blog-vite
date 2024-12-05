import express from "express"
// 引入EXPRESS的基础配置
import { EXPRESS } from "@/config.json"
const router = express.Router()
// 设置加密
const jwt = require("jsonwebtoken")
const { hash } = EXPRESS
router.get("/login", (req, res) => {
  //3.登录验证成功后创建 token
  // jwt.sign(数据, 加密字符串, 配置对象)
  const token = jwt.sign(
    {
      username: "zhangsan",
    },
    hash,
    {
      expiresIn: 60, //单位是 秒
    }
  )
  res.send(res.locals.result(token, "登录成功"))
})
export default router
