import express from "express"
import email from "@/router/api/reg/email"
const router = express.Router()
// 注册接口
router.post("/", (req, res) => {
  res.send(res.locals.result("", "注册成功~"))
})
// 邮箱发送接口
router.use(email)
export default router
