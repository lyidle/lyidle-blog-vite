import express from "express"
// 引入 上传 图片的 api
import img from "./img"
// 引入 上传 文件的 api
import files from "./files"
// 引入 删除 文件的 api
import remove from "./remove"
const router = express.Router()
router.use("/img", img)
router.use("/files", files)
router.use("/remove", remove)
export default router
