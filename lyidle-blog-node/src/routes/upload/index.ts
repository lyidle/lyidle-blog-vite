import express from "express"
// 引入 上传 图片的 api
import img from "./img"
const router = express.Router()
router.use("/img", img)
export default router
