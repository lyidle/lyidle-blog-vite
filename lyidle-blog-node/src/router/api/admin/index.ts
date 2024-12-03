import express from "express"
// 引入模拟数据
import announce from "@/mock/admin/notify"
const router = express.Router()
router.get("/announce", (req, res) => {
  res.send({
    status: 200,
    data: announce,
    message: "获取公告成功~",
  })
})
export default router
