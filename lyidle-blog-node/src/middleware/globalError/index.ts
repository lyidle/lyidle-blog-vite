import express from "express"
import type { Request, Response, NextFunction } from "express"
const router = express.Router()
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // 数据库插入校验
  if (err.name === "SequelizeValidationError") {
    return res.result(
      void 0,
      // err.errors.length === 1
      //   ? err.errors[0].message
      //   :
      err.errors.map((item: any) => item.message),
      false,
      400
    )
  }
  //token解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    return res.result(void 0, "TOKEN过期~", false, 401)
  }
})
module.exports = router
