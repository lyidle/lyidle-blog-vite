import express from "express"
const router = express.Router()
router.use((req, res, next) => {
  // 配置通用的返回格式
  res.result = (data: object, message: string, status: boolean = true) => {
    return {
      status: status,
      data: data,
      message: message,
    }
  }
  next()
})
module.exports = router
