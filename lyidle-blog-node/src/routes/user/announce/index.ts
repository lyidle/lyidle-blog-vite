import express from "express"
// 引入模拟数据
import announce from "@/mock/admin/notify"
const router = express.Router()
router.get("/", (req, res) => {
  res.send(res.result(announce, "获取公告成功~"))
})
export default router
