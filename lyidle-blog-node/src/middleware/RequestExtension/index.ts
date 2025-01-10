import express, { NextFunction } from "express"
// 引入 redis
const { getKey } = require("@/utils/redis")
const router = express.Router()
router.use(async (req, res, next) => {
  // 配置通用的返回格式
  res.result = (
    data: object,
    message: string | string[],
    status: boolean = true,
    code?: number,
    resCode?: number
  ) => {
    // 有最后一位 就以最后传入的状态码为准
    // 否则判断 status 来决定状态码 把错误状态码放到返回的 data 中
    res.status(resCode ? resCode : 200).send({
      code: status ? 200 : code ? code : 400,
      data,
      // 确保返回的错误信息为一个数组
      message: status
        ? message
        : Array.isArray(message)
        ? [...new Set(message.flat(Infinity))]
        : [message],
    })
    return
  }
  // 数据库验证跳转 错误中间件
  res.validateAuth = (err: any, next: NextFunction, cb: Function) => {
    if (err.name === "SequelizeValidationError") {
      next(err)
      return
    }
    // 打印其他不是验证错误的信息
    console.log(err)
    cb()
    return
  }
  if (await getKey("initialWebInfo"))
    return res.result(void 0, "正在初始化小站中，请稍后重试~")
  next()
})
module.exports = router
