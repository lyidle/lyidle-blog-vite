import express from "express"
// 引入模拟数据
import menu from "@/mock/menulist"
const router = express.Router()
router.post("/", (req, res) => {
  return res.result(menu, "设置菜单成功~")
})
export default router
