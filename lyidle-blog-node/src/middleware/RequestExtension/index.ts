import express, { NextFunction } from "express"
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
  // 验证跳转 错误中间件
  res.validateAuth = (err: any, next: NextFunction, cb: Function) => {
    // 数据库验证 失败
    if (err.name === "SequelizeValidationError") return next(err)
    // 数据库 unique 报错
    if (err.name === "SequelizeUniqueConstraintError") return next(err)
    // 其他自定义错误信息
    if (err.name === "otherError") return next(err)
    // 打印其他不是验证错误的信息
    console.log(err)
    cb()
    return
  }
  next()
})
module.exports = router
