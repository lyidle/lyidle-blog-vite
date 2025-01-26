import express from "express"
// 引入 上传 临时 图片的api
import temp from "./temp"
const router = express.Router()
router.use("/temp", temp)
export default router
