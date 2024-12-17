import express from "express"
// 引入模拟数据
import menu from "@/mock/menulist"
const router = express.Router()
router.get("/", (req, res) => {
  res.send(res.result(menu, "获取菜单成功~"))
})
export default router
