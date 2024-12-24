import express, { NextFunction } from "express"
const router = express.Router()
router.use((req, res, next) => {
  // 配置通用的返回格式
  res.result = (
    data: object,
    message: string,
    status: boolean = true,
    resultCode?: number
  ) => {
    // 有最后一位 就以最后传入的状态码为准
    // 否则判断 status 来决定状态码
    res.status(resultCode ? resultCode : !status ? 404 : 200).send({
      status,
      data,
      message,
    })
    return
  }
  // 数据库验证跳转 错误中间件
  res.validateAuth = (err: any, next: NextFunction, cb: Function) => {
    if (err.name === "SequelizeValidationError") {
      next(err)
      return
    }
    // 打印错误信息
    console.log(err)
    cb()
    return
  }
  next()
})
module.exports = router
