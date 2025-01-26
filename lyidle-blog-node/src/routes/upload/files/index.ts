import express from "express"
// 引入 上传 临时 图片的api
import img from "./img"
const router = express.Router()
router.use("/img", img)
export default router
