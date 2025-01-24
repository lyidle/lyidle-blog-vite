import express from "express"
// 引入 临时 图片 文件的api
import temp from "./temp"
const router = express.Router()
router.use("/temp", temp)
export default router
