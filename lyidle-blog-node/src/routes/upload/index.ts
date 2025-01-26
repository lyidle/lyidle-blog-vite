import express from "express"
// 引入 上传 图片的 api
import img from "./img"
// 引入 上传 文件的 api
import files from "./files"
const router = express.Router()
router.use("/img", img)
router.use("/files", files)
export default router
