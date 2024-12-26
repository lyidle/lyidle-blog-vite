import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入删除函数
import remove from "@/routes/user/admin/delete/remove"
// 引入 jwt
import { jwt, jwtExpand } from "@/middleware/auth"
const router = express.Router()
// 彻底删除
router.delete(
  "/",
  [jwt, jwtExpand],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await remove(req, res, true)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除用户失败~", false)
      )
    }
  }
)
export default router
