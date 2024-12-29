import express from "express"
// 引入移除函数
import remove from "@/routes/article/admin/delete/remove"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 彻底删除
router.delete(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await remove(req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "文章移到回收站失败~", false)
      )
    }
  }
)
export default router
