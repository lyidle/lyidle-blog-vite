import express from "express"
// 引入模拟数据
import menu from "@/mock/menulist"
// 引入 api/admin 路由
import admin from "@/router/api/admin"
const router = express.Router()
// 挂载路由
router.use("/admin", admin)
router.get("/", (req, res) => {
  res.send()
})
router.get("/menuList", (req, res) => {
  res.send(res.locals.result(menu, "获取菜单成功~"))
})
export default router
