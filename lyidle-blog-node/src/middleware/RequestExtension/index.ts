import express, { NextFunction } from "express"
const router = express.Router()
router.use((req, res, next) => {
  // 配置通用的返回格式
  res.result = (
    data: object,
    message: string,
    status: boolean = true,
    resultCode = 200
  ) => {
    res.status(resultCode).send({
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
    cb()
    return
  }
  next()
})
module.exports = router
