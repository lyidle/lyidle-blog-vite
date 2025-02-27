import express from "express"
// 引入 上传 临时 图片的api
import temp from "./temp"
// 临时转永久 给定静态资源下的url和作者与路径 api
import tempImgToPermanet from "./tempImgToPermanet"

const router = express.Router()
router.use("/temp", temp)
router.use("/tempImgToPermanet", tempImgToPermanet)
export default router
