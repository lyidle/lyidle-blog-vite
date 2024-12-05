import express from "express"
// 引入EXPRESS的基础配置
// import { EXPRESS } from "@/config.json"
// import { expressjwt } from "express-jwt"
import type { MyResponse } from "@/@types/express"
const router = express.Router()
router.use((req, res: MyResponse, next) => {
  // 配置通用的返回格式
  res.locals.result = (data, message, status = 200) => {
    return {
      status: status,
      data: data,
      message: message,
    }
  }
  next()
})
// hash 加密 用于用户信息加密
// const { hash } = EXPRESS
// router.use(
//   expressjwt({ secret: hash, algorithms: ["HS256"] }).unless({
//     path: [/^\/api\//],
//   })
// )
module.exports = router
