import express from "express"
// 引入 /api/article/get
import getArticle from "@/routes/article/getArticle"
// 引入 /api/article/search
import search from "@/routes/article/search"
// 引入 /api/article/carousel
import carousel from "@/routes/article/carousel"
// 引入 /api/article/recentPages
import recentPages from "@/routes/article/recentPages"
// 引入 api/article/admin
import admin from "@/routes/article/admin"
// 引入 api/article/getTags
import getTags from "./getTags"
// 引入 api/article/getCategories
import getCategories from "./getCategories"
// 引入 api/article/time
import time from "./time"
// 引入 api/article/look
import look from "./look"
// 引入 api/article/views
import views from "./views"
// 引入 api/article/likes
import likes from "./likes"
const router = express.Router()
// 挂载路由
router.use("/get", getArticle)
router.use("/likes", likes)
router.use("/views", views)
router.use("/time", time)
router.use("/look", look)
router.use("/search", search)
router.use("/carousel", carousel)
router.use("/recentPages", recentPages)
router.use("/admin", admin)
router.use("/getTags", getTags)
router.use("/getCategories", getCategories)
export default router
