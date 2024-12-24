import express from "express"
// 引入 /api/article/
import getArticle from "@/routes/article/getArticle"
// 引入 /api/article/search
import search from "@/routes/article/search"
// 引入 /api/article/carousel
import carousel from "@/routes/article/carousel"
// 引入 /api/article/recentPages
import recentPages from "@/routes/article/recentPages"
// 引入 api/article/admin
import admin from "@/routes/article/admin"
const router = express.Router()
// 挂载路由
router.use("/get", getArticle)
router.use("/search", search)
router.use("/carousel", carousel)
router.use("/recentPages", recentPages)
router.use("/admin", admin)
export default router
