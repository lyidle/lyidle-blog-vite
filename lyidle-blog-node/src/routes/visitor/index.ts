import { Router } from "express"
// 引入 uuidV4  生成临时文件的 id
import { v4 as uuidV4 } from "uuid"
// 引入模型
const { Visitor } = require("@/db/models")
const router = Router()

router.get("/", async (req, res, next) => {
  // 从请求头中获取 token
  const token = req.headers["authorization"]?.split(" ")[1]
  // 排除用户
  if (token) return res.result(void 0, "")
  const id = uuidV4()
  try {
    await Visitor.create({ name: id })
    return res.result(void 0, "")
  } catch (err: any) {
    return res.result(void 0, "")
  }
})

export default router
